const Router = require('express').Router({mergeParams : true});
const commentController = require('../controller/commentController');
const authController = require('../controller/authController');

Router.use(authController.protectRoutes);
Router.route("/").post(commentController.createComment);
Router.route("/:commentId").delete(commentController.deleteComment);


module.exports = Router;