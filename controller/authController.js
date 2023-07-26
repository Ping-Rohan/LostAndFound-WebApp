const res = require("express/lib/response");
const User = require("../model/userModel");
const AppError = require("../utils/AppError");
const CatchAsync = require("../utils/CatchAsync");
const jwt = require('jsonwebtoken');

exports.protectRoutes = CatchAsync(async(request , response , next) => {
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

exports.updatePassword = CatchAsync(async (request , response , next) => {
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