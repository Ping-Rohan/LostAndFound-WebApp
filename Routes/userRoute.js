const Router = require('express').Router();
const userController = require('../controller/userController');

Router.post('/signup' , userController.signUp);
Router.post('/login' , userController.login);

module.exports = Router;