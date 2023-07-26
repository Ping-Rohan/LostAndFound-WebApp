const Router = require('express').Router();
const userController = require('../controller/userController');
const {protectRoutes , updatePassword} = require('../controller/authController')

Router.post('/signup' , userController.signUp);
Router.post('/login' , userController.login);

Router.use(protectRoutes);

Router.patch('/update-password' , updatePassword);
Router.route('/update-me').patch(userController.updateUser);
module.exports = Router;