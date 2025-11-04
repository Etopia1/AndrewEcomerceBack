// routes/wishlistRoutes.js
const express = require("express");
const router = express.Router();
const { addToWishlist, removeFromWishlist, moveToCart, getWishlist } = require("../controllers/wishlistController");
const { verifyToken } = require("../middlewares/authMiddleware"); // if JWT middleware

router.post("/wishlist/add", addToWishlist);
router.delete("/wishlist/remove/:productId", removeFromWishlist);
router.post("/wishlist/move-to-cart/:productId", moveToCart);
router.get("/wishlist/:userId", getWishlist);

module.exports = router;
