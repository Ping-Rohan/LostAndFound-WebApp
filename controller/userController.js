const User = require("../model/userModel");
const {signAccessToken , signRefreshToken} = require("../utils/signToken");
const catchAsync = require('../utils/CatchAsync');
const AppError  = require('../utils/AppError');
const validateFields = require('../utils/validateFields');

exports.signUp = catchAsync(async (request, response , next) => {

  const user = await User.create(request.body);

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  response.status(200).json({
    message: "Account created successfully",
    user,
    accessToken,
    refreshToken,
  });
});

exports.login = catchAsync(async(request , response , next) => {
    const {email , password} = request.body;

    if(!email || !password) return next(new AppError('Please enter email and password both'));

    const userDocument = await User.findOne({email}).select("password");

    if(!userDocument || !(await userDocument.hasEnteredCorrectPassword(password , userDocument.password))) return next(new AppError('email or password incorrect'));

    const accessToken = signAccessToken(userDocument._id);
    const refreshToken = signRefreshToken(userDocument._id);

    response.status(200).json({
        message : "Logged in successfully" ,
        accessToken ,
        refreshToken
    })

})

exports.updateUser = catchAsync(async(request , response , next) => {
  if(request.body.password || request.body.confirmPassword) return next(new AppError('This route is not for password change'));

  const validUpdateFields = validateFields(request.body , "email" , "username");

  const docAfterUpdate = await User.findByIdAndUpdate(request._user._id , validUpdateFields ,{
    runValidators : true ,
    new : true
  });

  response.status(200).json({
    message : 'Fields updated successfully' ,
    user : docAfterUpdate
  })
})