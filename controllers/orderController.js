
const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2
  });


const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const userModel = require(`../models/userModel.js`);
const merchantModel = require(`../models/NewmarChModel.js`);
const productModel = require(`../models/ProductModel.js`);
const mongoose = require(`mongoose`);
const {sendMail} = require(`../helpers/sendMail.js`);
const { orderConfirmationTemplate, paymentReceiptTemplate, newOrderNotificationTemplate } = require('../helpers/html.js');
// const { initializePayment, verifyPayment } = require('../helpers/KoraPay.js');

// const formatter = new Intl.NumberFormat('en-NG', {
//     style: 'currency',
//     currency: 'NGN',
//     minimumFractionDigits: 2
//   });

const checkout = async (req, res) => {
    try {
        let userId = req.user ? req.user._id : null;
        let cart;

        // Check if the user is logged in
        if (userId) {
            // Logged-in user: find the cart associated with the user
            cart = await Cart.findOne({ user: userId }).populate('items.product');

            // If the cart is empty or undefined, return a user-friendly message
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ message: "Your cart is empty. Please add items to your cart before proceeding to checkout." });
            }
        } else {
            return res.status(400).json({ message: "User is not authenticated. Please log in to proceed with the checkout." });
        }

        // Filter out any deleted products (items where the product is null)
        cart.items = cart.items.filter(item => item.product !== null);

        // If all items are deleted, return an error
        if (cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart contains deleted products. Please update your cart." });
        }

        // Calculate product total amount
        let productTotal = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

        // Assuming a fixed delivery charge
        const deliveryCharge = 1050;

        // Calculate the total amount including the delivery charge
        const totalAmount = productTotal + deliveryCharge;

        // Save the cart after calculating the total price
        await cart.save();

        // Format the cart items and totals for the response
        const formattedCart = {
            items: cart.items.map(item => ({
                productName: item.product.productName,
                quantity: item.quantity,
                price: item.price,
                productImage: item.product.productImage,
            })),
        };

        res.status(200).json({
            message: "Checkout initiated",
            cart: formattedCart,
            productTotal: productTotal,
            deliveryCharge: deliveryCharge,
            totalAmount: totalAmount
        });
    } catch (error) {
        // Catch all other errors and return a user-friendly message
        res.status(500).json({ message: "Something went wrong during checkout. Please try again later." });
    }
};


const confirmOrder = async (req, res) => {
    try {
        const { 
            customerFirstName, 
            customerLastName, 
            customerAddress, 
            customerPhoneNumber, 
            city, 
            country, 
            paymentDetails, 
            paymentMethod 
        } = req.body;

        const userId = req.user ? req.user._id : null;

        // Ensure the user is logged in
        if (!userId) {
            return res.status(400).json({ message: 'User is not authenticated' });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the cart for the logged-in user
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        // Populate merchant information for each item in the cart
        const populatedCart = await populateCartWithMerchantInfo(cart);

        // Group products by merchants to avoid sending multiple emails to the same merchant
        const merchantOrders = groupItemsByMerchant(populatedCart.items);

        // Calculate the total amount for the overall order (all products combined)
        const productTotal = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        const deliveryCharge = 1050; // Fixed delivery charge

        const totalAmount = productTotal + deliveryCharge;

        // Create a new order
        const newOrder = await Order.create({
            user: userId,
            items: populatedCart.items,
            totalAmount: totalAmount,
            customerFirstName,
            customerLastName,
            customerAddress,
            customerPhoneNumber,
            city,
            country: country || 'Nigeria',
            orderStatus: 'Processing',
            paymentStatus:  paymentMethod === 'Bank' 
            ? 'Paid'  : "Pending",
            // : paymentMethod === 'Cash on Delivery' 
            // ? 'Pending' 
            // : null, 
            paymentMethod,
            paymentDetails
        });

        // Link the order to the user
        user.orders.push(newOrder._id);
        await user.save();

        // Clear the user's cart after saving the order
        await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [], totalPrice: 0 } }, { new: true });

        // Send confirmation email to the user
        await sendMail({
            subject: "Order Confirmation",
            email: user.email,
            html: orderConfirmationTemplate(user.fullName, newOrder._id, newOrder.orderDate, newOrder.items, totalAmount, deliveryCharge),
        });

      
        if (paymentMethod === 'Bank') {
            if (!paymentDetails || !paymentDetails.reference) {
                return res.status(400).json({
                    message: "Payment details are missing or invalid for Bank payment method."
                });
            }
        
            const emailData = {
                userName: user.fullName,
                paymentReference: paymentDetails.reference,
                amountPaid: `$${paymentDetails.amount}`,
                transactionDate: new Date().toLocaleString("en-US", { 
                            year: 'numeric', 
                            month: '2-digit', 
                            day: '2-digit', 
                            hour: '2-digit', 
                            minute: '2-digit', 
                            hour12: true 
                        }),
                currentYear: new Date().getFullYear(),
            };
        
            await sendMail({
                email: user.email,
                subject: "Payment Successful",
                html: paymentReceiptTemplate(emailData),
            });
        }
        // Send a separate email to each merchant with the price specific to their products
        for (const [merchantId, merchantOrder] of Object.entries(merchantOrders)) {
            const merchant = merchantOrder.merchant;
            const merchantItems = merchantOrder.items;
            const merchantTotal = merchantOrder.total;

            await sendMail({
                subject: "New Order Received",
                email: merchant.email,
                html: newOrderNotificationTemplate(
                    merchant.fullName,
                    user.fullName,
                    user.phoneNumber,
                    customerAddress,
                    newOrder._id,
                    newOrder.orderDate,
                    merchantItems,
                    merchantTotal
                ),
            });

            // Save order to the merchant's order list
            merchant.orders.push(newOrder._id);
            await merchant.save();
        }

        // Clean up the order data before sending the response
        const cleanOrder = {
            user: newOrder.user,
            items: newOrder.items.map(item => ({
                productName: item.productName,
                quantity: item.quantity,
                price: formatter.format(item.price),
                productImage: item.productImage
            })),
            totalAmount: formatter.format(newOrder.totalAmount),
            customerFirstName: newOrder.customerFirstName,
            customerLastName: newOrder.customerLastName,
            customerAddress: newOrder.customerAddress,
            customerPhoneNumber: newOrder.customerPhoneNumber,
            city: newOrder.city,
            country: newOrder.country,
            orderStatus: newOrder.orderStatus,
            orderDate: newOrder.orderDate,
            _id: newOrder._id
        };

        res.status(201).json({
            message: "Order placed successfully",
            order: cleanOrder
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


// Helper function to populate the cart with merchant info
const populateCartWithMerchantInfo = async (cart) => {
    const cartItems = cart.items;
    for (let i = 0; i < cartItems.length; i++) {
        const productId = cartItems[i].product;
        const product = await productModel.findById(productId).populate('merchant');
        if (!product) {
            throw new Error("Product not found");
        }
        cartItems[i].merchant = product.merchant;  // Attach the merchant to the cart item
    }
    cart.items = cartItems;
    return cart;
};

// Helper function to group items by merchant
const groupItemsByMerchant = (items) => {
    const merchantOrders = {};
    items.forEach(item => {
        const merchantId = item.merchant._id;
        if (!merchantOrders[merchantId]) {
            merchantOrders[merchantId] = {
                merchant: item.merchant,
                items: [],
                total: 0
            };
        }
        merchantOrders[merchantId].items.push(item);
        merchantOrders[merchantId].total += item.quantity * item.price; // Calculate total for each merchant
    });
    return merchantOrders;
};


const getAllOrders = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;

        // Ensure the user is authenticated
        if (!userId) {
            return res.status(401).json({ message: "User is not authenticated." });
        }

        // Find the user by their ID
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Fetch all orders for the user
        const orders = await Order.find({ user: userId })
            .sort({ orderDate: -1 })
            .populate("items.product"); // Populate referenced product details

        // Return orders or an empty array if none are found
        return res.status(200).json({
            message: orders.length > 0 ? "Orders fetched successfully." : "No orders found.",
            orders,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            message: "An error occurred while fetching orders.",
            error: error.message,
        });
    }
};

const userDeleteOrder = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format." });
        }

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid order ID format." });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const order = await Order.findOne({ _id: orderId, user: userId }).populate('items.product');
        if (!order) {
            return res.status(404).json({ message: "Order not found for this user." });
        }

        if (order.paymentStatus !== 'Pending') {
            return res.status(400).json({ message: "You can only delete orders that have not been paid for." });
        }

        // Notify merchants via Socket.IO
        const merchantNotifications = order.items.map(async (item) => {
            const product = await productModel.findById(item.product);
            if (product && product.merchant) {
                const merchant = await merchantModel.findById(product.merchant);

                if (merchant) {
                    const notificationMessage = {
                        type: "Order Deleted",
                        message: `Order with ID ${order._id} has been deleted.`,
                        timestamp: new Date(),
                        orderId: order._id,
                    };

                    // Initialize notifications array if not already present
                    if (!Array.isArray(merchant.notifications)) {
                        merchant.notifications = [];
                    }

                    merchant.notifications.push(notificationMessage); // Add notification
                    await merchant.save();

                    // Check if the merchant is connected
                   
                }
            }
        });

        await Promise.all(merchantNotifications);

        await Order.findByIdAndDelete(orderId);
        user.orders = user.orders.filter(id => id.toString() !== orderId);
        await user.save();

        res.status(200).json({ message: "Order deleted successfully and merchants notified." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};




  
  // Route to handle updating the order status
  

  const getOrderDetails = async (req, res) => {
    try {
      const userId = req.user?._id;
      const { orderId } = req.params;
  
      // Validate IDs
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: "Invalid ID format." });
      }
            // Find the user
            const user = await userModel.findById(userId);
            if (!user) {
              return res.status(404).json({ message: "User not found." });
            }
  
      // Find the order directly linked to the user
      const order = await Order.findOne({ _id: orderId }).populate("items");
  
      if (!order) {
        return res.status(404).json({ message: "Order not found for this user." });
      }
  
      res.status(200).json({
        message: "Order details fetched successfully.",
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
 

const getMerchantOrders = async (req, res) => {
  try {
    const merchantId = req.params.merchantId; // 🧩 Get from URL params
    if (!mongoose.Types.ObjectId.isValid(merchantId)) {
      return res.status(400).json({ message: "Invalid merchant ID format." });
    }

    // 🧩 Aggregate orders where any product belongs to this merchant
    const orders = await Order.aggregate([
      { $unwind: "$items" },

      // ✅ Join product details
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },

      // ✅ Filter for this merchant’s products
      {
        $match: {
          "productDetails.merchant": new mongoose.Types.ObjectId(merchantId),
        },
      },

      // ✅ Group by order to rebuild full order info
      {
        $group: {
          _id: "$_id",
          totalAmount: {
            $sum: {
              $multiply: [
                { $toDouble: "$items.price" },
                { $toInt: "$items.quantity" },
              ],
            },
          },
          orderStatus: { $first: "$orderStatus" },
          createdAt: { $first: "$createdAt" },
          user: { $first: "$user" },
          items: {
            $push: {
              productName: "$productDetails.productName",
              image: "$productDetails.image",
              price: "$items.price",
              quantity: "$items.quantity",
            },
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({
      message: "Merchant orders fetched successfully.",
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching merchant orders:", error);
    res.status(500).json({ message: error.message });
  }
};

const getMerchantEarnings = async (req, res) => {
  try {
    // Get merchant ID from user, params, or query
    const merchantId =
      (req.user && req.user._id) ||
      req.params.merchantId ||
      req.query.merchantId;

    console.log("Merchant ID received:", merchantId);

    // Validate merchant ID
    if (!merchantId || !mongoose.Types.ObjectId.isValid(merchantId)) {
      return res
        .status(400)
        .json({ message: `Invalid merchant ID format: ${merchantId}` });
    }

    // Verify merchant exists
    const merchant = await merchantModel.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found." });
    }

    // Find all orders that include this merchant’s products
    const orders = await Order.find({ "items.product": { $exists: true } })
      .populate({
        path: "items.product",
        match: { merchant: merchantId },
        select: "merchant productName productPrice",
      })
      .lean();

    let totalEarnings = 0;
    let totalOrders = 0;
    const merchantSales = [];

    for (const order of orders) {
      let merchantOrderTotal = 0;

      for (const item of order.items) {
        if (
          item.product &&
          item.product.merchant?.toString() === merchantId.toString()
        ) {
          const itemTotal = item.quantity * parseFloat(item.price);
          merchantOrderTotal += itemTotal;
          totalEarnings += itemTotal;
        }
      }

      if (merchantOrderTotal > 0) {
        totalOrders++;
        merchantSales.push({
          orderId: order._id,
          orderDate: order.createdAt,
          total: merchantOrderTotal,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
        });
      }
    }

    // ✅ Format in USD
    const formattedEarnings = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(totalEarnings);

    res.status(200).json({
      message: "Merchant earnings calculated successfully.",
      merchant: {
        id: merchant._id,
        name: merchant.fullName || merchant.storeName,
      },
      summary: {
        totalOrders,
        totalEarnings: formattedEarnings,
      },
      sales: merchantSales,
    });
  } catch (error) {
    console.error("Error calculating merchant earnings:", error);
    res.status(500).json({ message: error.message });
  }
};


// ✅ Top Selling Products API
const getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },

      // ✅ Convert price and quantity to numbers before multiplying
      {
        $addFields: {
          numericPrice: { $toDouble: "$items.price" },
          numericQty: { $toInt: "$items.quantity" },
        },
      },

      {
        $group: {
          _id: "$productDetails._id",
          name: { $first: "$productDetails.productName" },
          totalSold: { $sum: "$numericQty" },
          totalRevenue: { $sum: { $multiply: ["$numericPrice", "$numericQty"] } },
          image: { $first: "$productDetails.image" },
          merchant: { $first: "$productDetails.merchant" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      message: "Top selling products fetched successfully",
      data: topProducts,
    });
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    res.status(500).json({ message: error.message });
  }
};



// 🟢 Get Monthly Sales Trend
const getSalesTrend = async (req, res) => {
  try {
    const salesTrend = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },

      // ✅ Convert values to numeric before calculations
      {
        $addFields: {
          numericPrice: { $toDouble: "$items.price" },
          numericQty: { $toInt: "$items.quantity" },
        },
      },

      // ✅ Group total sales per month
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: { $multiply: ["$numericPrice", "$numericQty"] } },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // ✅ Map month numbers → names
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const formattedData = salesTrend.map((item) => ({
      month: monthNames[item._id - 1],
      sales: item.totalSales,
    }));

    res.status(200).json({
      message: "Sales trend fetched successfully.",
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching sales trend:", error);
    res.status(500).json({ message: error.message });
  }
};




// ✅ Get single order by ID (merchant only)
const getMerchantOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const merchantId = req.user._id;

    // Validate orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID.' });
    }

    // Find the order and populate product details
    const order = await Order.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(orderId) } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      { $unwind: '$productDetails' },
      {
        $match: { 'productDetails.merchant': new mongoose.Types.ObjectId(merchantId) },
      },
      {
        $group: {
          _id: '$_id',
          totalAmount: { $first: '$totalAmount' },
          orderStatus: { $first: '$orderStatus' },
          paymentStatus: { $first: '$paymentStatus' },
          createdAt: { $first: '$createdAt' },
          customerFirstName: { $first: '$customerFirstName' },
          customerLastName: { $first: '$customerLastName' },
          customerAddress: { $first: '$customerAddress' },
          customerPhoneNumber: { $first: '$customerPhoneNumber' },
          city: { $first: '$city' },
          country: { $first: '$country' },
          items: {
            $push: {
              productName: '$productDetails.productName',
              image: '$productDetails.image',
              price: '$items.price',
              quantity: '$items.quantity',
            },
          },
        },
      },
    ]);

    if (!order || order.length === 0) {
      return res.status(404).json({ message: 'Order not found or you do not have access.' });
    }

    const singleOrder = order[0];
    singleOrder.customerName = `${singleOrder.customerFirstName} ${singleOrder.customerLastName}`;

    res.status(200).json({
      message: 'Order fetched successfully',
      data: singleOrder,
    });
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update order status (merchant only)
const updateMerchantOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newStatus } = req.body;
    const merchantId = req.user._id;

    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const merchantOwnsOrder = order.items.some(
      (item) => item.merchant && item.merchant.equals(merchantId)
    );

    if (!merchantOwnsOrder) {
      return res.status(403).json({ message: 'You are not authorized to update this order.' });
    }

    order.orderStatus = newStatus;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully.', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
    checkout,
    confirmOrder,
    getAllOrders,
      getMerchantOrderById,
  updateMerchantOrderStatus,
    getOrderDetails,
    getMerchantOrders,
    userDeleteOrder,
    getMerchantEarnings,
    getTopSellingProducts,
    getSalesTrend
}