const Wishlist = require("../models/wishlistModel");
const Product = require("../models/ProductModel")
const Cart = require("../models/cartModel");
const User = require("../models/userModel");

/**
 * ✅ Add or toggle item in Wishlist
 */
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId; // ✅ supports both token user or frontend ID
    const { productId } = req.body;

    if (!userId || !productId)
      return res.status(400).json({ message: "User ID and Product ID are required." });

    const user = await User.findById(userId);
    const product = await Product.findById(productId);
    if (!user) return res.status(404).json({ message: "User not found." });
    if (!product) return res.status(404).json({ message: "Product not found." });

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) wishlist = new Wishlist({ user: userId, items: [] });

    const exists = wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    if (exists) {
      // ✅ Toggle off if already in wishlist
      wishlist.items = wishlist.items.filter(
        (item) => item.product.toString() !== productId
      );
      await wishlist.save();
      return res.status(200).json({ message: "Item removed from wishlist.", data: wishlist });
    }

    wishlist.items.push({
      product: productId,
      productName: product.productName,
      price: product.productPrice,
      productImage: product.productImage,
      merchant: product.merchant,
    });

    await wishlist.save();

    res.status(200).json({
      message: "Item added to wishlist successfully.",
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ Get all Wishlist items for a user
 */
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user?._id || req.params.userId;

    const wishlist = await Wishlist.findOne({ user: userId }).populate("items.product");

    if (!wishlist) return res.status(200).json({ items: [] });

    res.status(200).json({ items: wishlist.items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ Remove specific item from Wishlist
 */
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found." });

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );

    await wishlist.save();

    res.status(200).json({ message: "Item removed from wishlist successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ Move item from Wishlist → Cart
 */
exports.moveToCart = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found." });

    const item = wishlist.items.find(
      (i) => i.product.toString() === productId
    );
    if (!item)
      return res.status(404).json({ message: "Item not found in wishlist." });

    // ✅ Add to Cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [], totalPrice: 0 });

    const existingItem = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        product: productId,
        productName: item.productName,
        quantity: 1,
        price: item.price,
        productImage: item.productImage,
        merchant: item.merchant,
      });
    }

    // ✅ Remove from Wishlist
    wishlist.items = wishlist.items.filter(
      (i) => i.product.toString() !== productId
    );

    await wishlist.save();
    await cart.save();

    res.status(200).json({
      message: "Item moved to cart successfully.",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
