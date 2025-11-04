const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  searchCategory
} = require('../controllers/categoryController');
const { authorize} = require(`../middlewares/Auth`)


// Category Routes
router.post('/category', authorize, createCategory); // Create a new category
router.get('/category', getAllCategories); // Get all categories
router.get('/category', searchCategory); // Get all categories
router.get('/category/:categoryId', getCategoryById); // Get a category by ID
router.put('/category/:categoryId', authorize, updateCategory); // Update a category by ID
router.delete('/category/:categoryId', authorize,  deleteCategory); // Delete a category by ID

module.exports = router;
