const Router = require('express').Router();
const userController = require('../controller/userController');
const {protectRoutes , updatePassword , forgotPassword , resetPassword} = require('../controller/authController')
const ratingRoute = require('./ratingRoute');

Router.post('/signup' , userController.signUp);
Router.post('/login' , userController.login);
Router.post('/forgot-password' , forgotPassword);
Router.post('/reset-password/:token' , resetPassword);

Router.use(protectRoutes);

Router.patch('/update-password' , updatePassword);
Router.route('/update-me').patch(userController.updateUser);
Router.get('/get-me' , userController.getMe);
Router.use("/:targetUser/rate" , ratingRoute);
module.exports = Router;