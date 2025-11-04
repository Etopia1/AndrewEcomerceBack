const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
      product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
      },
      productName:{
        type: String,
        required: true
      },
      quantity: {
          type: Number,
          required: true,
          default: 1
      },
      price:{
          type: String,
          required: true
      },
      productImage:{
          type: String
      },
  }],
    totalAmount: {
        type: Number,
    },
    customerFirstName: {
        type: String,
        required: true
    },
    customerLastName: {
        type: String,
        required: true
    },
    customerAddress:{
      type: String,
      required: true
    },
    customerPhoneNumber: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'Nigeria'
    },
    orderStatus: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing'
    },
    paymentStatus: { type: String, default: 'Pending' },
    paymentMethod: { type: String, required: true },
    paymentDetails: {
      type: Object
    },
    orderDate: {
      type: Date,
      default: Date.now
   }
    
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
