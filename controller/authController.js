const User = require("../model/userModel");
const AppError = require("../utils/AppError");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const catchAsync = require("../utils/CatchAsync");


exports.protectRoutes = catchAsync(async(request , response , next) => {
    let token;
    if(request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
        token = request.headers.authorization.split(" ")[1];
    }

    if(!token) return next(new AppError('Please provide access token' , 402));

    const decoded = jwt.verify(token , process.env.JWT_SECRET);


    const userDoc = await User.findById(decoded.id).select('password');

    if(!userDoc) return next(new AppError('User no longer exist' , 404));

    if(userDoc.hasChangedPasswordRecently(decoded.iat)) return next(new AppError('User has changed password recently . Please login with new password' , 402));

    request._user = userDoc;

    next();

})

exports.updatePassword = catchAsync(async (request , response , next) => {
    const {currentPassword , newPassword , confirmPassword} = request.body;

    if(!currentPassword || !newPassword) return next(new AppError("Please enter current and new password both" , 400));

    const userDoc = await User.findById(request._user._id);

    if(!(await userDoc.hasEnteredCorrectPassword(currentPassword , request._user.password))) return next(new AppError('Incorrect password entered' , 401));

    userDoc.password = newPassword;
    userDoc.confirmPassword = confirmPassword;
    await userDoc.save();

    response.status(200).json({
        message : 'Password updated successfully'
    })

})

exports.forgotPassword = catchAsync(async(request , response , next) => {
    const {email} = request.body;

    const userDoc = await User.findOne({email});

    if(!userDoc) return next(new AppError("Invalid email address provided"));

    const token = userDoc.generatePasswordToken();
    // validate because token is stored first time not updated
    await userDoc.save({validateBeforeSave : false});

    response.status(200).json({
        message : "Reset token sent to your email" ,
        token ,
    })

})

exports.resetPassword = catchAsync(async(request , response , next) => {
    const token  = request.params.token;
    if(!token) return next(new AppError("Please provide reset token"));
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const userDoc = await User.findOne({passwordResetToken : hashedToken , passwordResetTokenExpiresAt : {$gt : Date.now()} });

    if(!userDoc) return next(new AppError('Invalid token or token has been expired'));

    userDoc.password = request.body.password;
    userDoc.confirmPassword = request.body.confirmPassword;
    userDoc.passwordResetToken = undefined;
    userDoc.passwordResetTokenExpiresAt = undefined;
    await userDoc.save();

    response.status(200).json({
        message : "Password successfully updated" ,
    })
})

exports.logout = catchAsync(async(request , response , next) => {
    response.clearCookie('refreshToken');
    response.status(200).json({
        message : "Logged out successfully"
    })
})