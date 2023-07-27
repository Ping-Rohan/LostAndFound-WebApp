const Router = require('express').Router({mergeParams : true});
const ratingController = require('../controller/ratingController');
const authController = require('../controller/authController');

Router.use(authController.protectRoutes);

Router.route('/').post(ratingController.postRating);
Router.route("/:ratingId").delete(ratingController.deleteRating);

module.exports = Router;