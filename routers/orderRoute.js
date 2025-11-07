const express = require("express");
const router = express.Router();
const {
  checkout,
  confirmOrder,
  getAllOrders,
  getMerchantOrders,
  getOrderDetails,
  updateMerchantOrderStatus,
  getMerchantOrderById,
  userDeleteOrder,
  getMerchantEarnings,
  getSalesTrend,
  getTopSellingProducts
} = require("../controllers/orderController");
const { authenticate, authorize } = require("../middlewares/Auth");

// 🛒 Checkout routes
router.post("/checkout", authenticate, checkout);
router.post("/confirm-order", authenticate, confirmOrder);

// 📦 User orders
router.get("/orders", authenticate, getAllOrders);
router.get("/getOrderDetails/:orderId", authenticate, getOrderDetails);
router.delete("/userdeleteOrder/:orderId", authenticate, userDeleteOrder);

// 🧑‍💼 Merchant routes
router.get("/merchant/earnings/:merchantId", getMerchantEarnings);
router.get("/merchant-orders/:merchantId", getMerchantOrders);
router.get("/top-selling", getTopSellingProducts);
router.get("/sales-trend", getSalesTrend);
router.get("/merchant-order/:orderId", getMerchantOrderById);
router.patch("/merchant-order/:orderId/status", authorize, updateMerchantOrderStatus);

module.exports = router;
