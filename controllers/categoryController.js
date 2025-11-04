const categoryModel = require('../models/categoryModel');
const cloudinary = require('../untils/cloudinary');
const fs = require('fs');
const mongoose = require(`mongoose`)
const productModel = require("../models/ProductModel")

// Create a new category
// const createCategory = async (req, res) => {
//   try {
//     const { categoryName, categoryDescription } = req.body;
//     const file = req.files.categoryImage;

//     if (!categoryName || !categoryDescription || !file) {
//       return res.status(400).json({ message: 'Please provide all required fields.' });
//     }

//     // Upload image to Cloudinary
//     const image = await cloudinary.uploader.upload(file.tempFilePath);
//     fs.unlink(file.tempFilePath, (err) => {
//       if (err) console.error('Failed to delete the file locally:', err);
//     });

//     // Create a new category
//     const newCategory = await categoryModel.create({
//       categoryName,
//       categoryDescription,
//       categoryImage: image.secure_url,
//     });

//     res.status(201).json({
//       message: 'Category created successfully',
//       data: newCategory,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const createCategory = async (req, res) => {
  try {
    const { categoryName, categoryDescription } = req.body;

    if (!categoryName || !categoryDescription) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    if (!req.files || !req.files.categoryImage) {
      return res.status(400).json({ message: 'Category image is required.' });
    }

    const file = req.files.categoryImage;

    // Upload image to Cloudinary
    const image = await cloudinary.uploader.upload(file.tempFilePath);
    fs.unlink(file.tempFilePath, (err) => {
      if (err) console.error('Failed to delete the file locally:', err);
    });

    // Create a new category
    const newCategory = await categoryModel.create({
      categoryName,
      categoryDescription,
      categoryImage: image.secure_url,
    });

    res.status(201).json({
      message: 'Category created successfully',
      data: newCategory,
    });
  } catch (error) {
    if (error.code === 11000) {
        // Handle duplicate key error (E11000)
        const duplicateField = Object.keys(error.keyPattern)[0]; // Get the duplicate field (e.g., email)
        return res.status(400).json({ message: `A Category with this ${duplicateField} already exists.` });
    }
    res.status(500).json({message: error.message});
  
}
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    if (categories.length === 0) {
      return res.status(404).json({ message: 'No categories found.' });
    }

    res.status(200).json({
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get a single category by ID
// const getCategoryById = async (req, res) => {
//   try {
//     const { categoryId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(categoryId)) {
//       return res.status(400).json({ message: 'Invalid ID format.' });
//     }

//     const category = await categoryModel.findById(categoryId);
//     if (!category) {
//       return res.status(404).json({ message: 'Category not found.' });
//     }

//     res.status(200).json({
//       message: 'Category retrieved successfully',
//       data: category,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getCategoryById = async (req, res) => {
//   try {
//     const { categoryId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(categoryId)) {
//       return res.status(400).json({ message: 'Invalid ID format.' });
//     }

//     // Find the category by ID
//     const category = await categoryModel.findById(categoryId);
//     if (!category) {
//       return res.status(404).json({ message: 'Category not found.' });
//     }

//     // Fetch products under the category using the categoryId
//     const products = await productModel.find({ category: categoryId })

//     res.status(200).json({
//       message: 'Category retrieved successfully',
//       data: {
//         category,
//         products,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Validate if categoryId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    // Find the category by its ID
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    // Fetch products that belong to this category, with all details (id, name, price, etc.)
    const products = await productModel
      .find({ category: categoryId }) // Find products by categoryId
      .select('productName productDescription  productPrice _id productImage category') // Select all necessary fields
      .lean(); // Convert to plain JavaScript objects for easier manipulation

    // Return the category and all products under this category
    res.status(200).json({
      message: 'Category retrieved successfully',
      data: {
        category,
        products, // Return full product data
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update a category
const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { categoryName, categoryDescription } = req.body;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    let categoryImage = category.categoryImage;

    if (req.files && req.files.categoryImage) {
      const file = req.files.categoryImage;

      // Upload new image to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(file.tempFilePath);
      categoryImage = uploadedImage.secure_url;

      // Delete the local temp file
      fs.unlink(file.tempFilePath, (err) => {
        if (err) console.error('Failed to delete the file locally:', err);
      });
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      categoryId,
      {
        categoryName: categoryName || category.categoryName,
        categoryDescription: categoryDescription || category.categoryDescription,
        categoryImage,
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const searchCategory = async (req, res) => {
  try {
      const { searchTerm } = req.body;

      if (!searchTerm) {
          return res.status(400).json({ message: "Please enter a search term" });
      }

      // Find products where the productName matches the search term (case-insensitive)
      const category = await categoryModel.find({
        categoryName: { $regex: searchTerm, $options: 'i' }
      });

      if (category.length === 0) {
          return res.status(404).json({ message: "No products found" });
      }

      res.status(200).json({
          message: "Products retrieved successfully",
          data: category
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Validate category ID format
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    // Find the category by ID
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    // Find all products in this category
    const productsInCategory = await productModel.find({ category: categoryId });

    // Delete all products in the category
    if (productsInCategory.length > 0) {
      await productModel.deleteMany({ category: categoryId });
    }

    // Delete the category itself
    await categoryModel.findByIdAndDelete(categoryId);

    res.status(200).json({ message: 'Category and all associated products deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  searchCategory
};
