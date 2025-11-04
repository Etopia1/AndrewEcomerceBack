const express = require('express');
const router = express.Router();

// Import the controller
const {
    checkout,
    confirmOrder,
    getAllOrders,
    getMerchantOrders,
    getOrderDetails,
    updateOrderStatus,
    userDeleteOrder
} = require('../controllers/orderController');
const midasValidator = require('../middlewares/validator')
 // Adjust the path if necessary
const { authenticate} = require("../middlewares/Auth")
const {authorize} = require('../middlewares/Auth')

// Middleware for authentication (this should be your authentication logic)
// const authenticateUser = require('');


// Route for checkout
router.post('/checkout', authenticate, checkout);

// Route for confirming an order
router.post('/confirm-order' , authenticate, confirmOrder);

// Route for fetching all orders for the user
router.get('/orders', authenticate, getAllOrders);
router.get('/getOrderDetails/:orderId', authenticate, getOrderDetails);
router.put('/updateStatus/:orderId', authorize, updateOrderStatus);
router.delete('/userdeleteOrder/:orderId', authenticate, userDeleteOrder);

// Route for fetching merchant orders
router.get('/merchant-orders', authorize, getMerchantOrders);

module.exports = router;
