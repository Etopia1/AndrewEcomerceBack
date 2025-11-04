// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
// const 
const {addToCart, getUserCart} =require('../controllers/cartController')

router.post('/add',  addToCart)
router.get('/',  getUserCart)

module.exports = router;
