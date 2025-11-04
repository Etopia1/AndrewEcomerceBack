// controllers/itemController.js
const Item = require('../models/itemModel');
const Category = require('../models/categoryModel');

// Add new Items
exports.addItem = async (req, res) => {
    const { name, description, price, sellerId, categoryId } = req.body;
    const imageUrl = req.file.path;
  
    try {
      const category = await Category.findById(categoryId);  // Find category by ID
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      const newItem = new Item({
        name,
        description,
        price,
        sellerId,
        imageUrl,
        category: categoryId  // Store the category ID
      });
  
      await newItem.save();
      res.status(201).json({ message: 'Item added successfully', newItem });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  exports.getItemsByCategory = async (req, res) => {
    try {
      const { categoryId } = req.params; // Get categoryId from the URL params
  
      // Find items that belong to the category
      const items = await Item.find({ category: categoryId }).populate('category');
  
      if (!items || items.length === 0) {
        return res.status(404).json({
          message: "No items found in this category",
        });
      }
  
      // Return the found items
      res.status(200).json(items);
    } catch (error) {
      // Handle errors
      res.status(500).json({
        message: error.message,
      });
    }
  };
  


