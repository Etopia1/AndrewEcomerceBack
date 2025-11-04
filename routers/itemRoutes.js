// routes/itemRoutes.js
const express = require('express');
const { addItem, getItemsByCategory } = require('../controllers/itemController');
const upload = require('../middleware/multerConfig');
const router = express.Router();
const {addToCart} =require('../controllers/cartController')
// Route to add a new item with image and categorya
router.post('/add-item', upload, addItem);
// router.post('/add-item', upload, getItemsByCategory);
router.get('/category/:categoryId', getItemsByCategory);
router.post('/add',  addToCart)

module.exports = router;
