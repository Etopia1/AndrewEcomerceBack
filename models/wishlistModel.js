const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        productName: String,
        price: Number,
        productImage: String,
        merchant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "merchants",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
