const Router = require('express').Router();
const lostItemController = require('../controller/lostItemController');
const authController = require('../controller/authController');

Router.route('/').get(lostItemController.getAllLostItems);
Router.use(authController.protectRoutes);

Router.route('/')
    .post(lostItemController.createLostItem)

Router.route("/:id").patch(lostItemController.updateLostItem).get(lostItemController.getLostItem).delete(lostItemController.deleteLostItem);

module.exports = Router;