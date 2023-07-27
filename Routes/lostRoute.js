const Router = require('express').Router();
const lostItemController = require('../controller/lostItemController');
const authController = require('../controller/authController');
const commentRoute = require('./commentRoute');

Router.route('/').get(lostItemController.getAllLostItems);
Router.use(authController.protectRoutes);

Router.route('/')
    .post(lostItemController.createLostItem)

Router.route("/:id").patch(lostItemController.updateLostItem).get(lostItemController.getLostItem).delete(lostItemController.deleteLostItem);
Router.use("/:lostItemId/comment" , commentRoute); 

module.exports = Router;