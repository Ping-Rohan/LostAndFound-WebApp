const Router = require('express').Router();
const userController = require('../controller/userController');
const {protectRoutes , updatePassword , forgotPassword , resetPassword} = require('../controller/authController')

Router.post('/signup' , userController.signUp);
Router.post('/login' , userController.login);
Router.post('/forgot-password' , forgotPassword);
Router.post('/reset-password/:token' , resetPassword)

Router.use(protectRoutes);

Router.patch('/update-password' , updatePassword);
Router.route('/update-me').patch(userController.updateUser);
module.exports = Router;