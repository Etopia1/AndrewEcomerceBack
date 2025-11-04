// const { boolean } = require('joi');
// const mongoose = require('mongoose')

// const userSchema = new mongoose.Schema({
//     fullName: {
//         type: String,
//         require: true
//     },
//     email: {
//         type: String,
//         require: true,
//         unique: true,
//         lowercase: true, // Store emails in lowercase
//         trim: true, // Removes spaces before or after the email
//     },
//     password: {
//         type: String,
//         require: true
//     },
//     phoneNumber: {
//         type: String,
//         require: true
//     },
//     address: {
//         type: String
//     },
//     isVerified:{
//         type: Boolean,
//         default: false
//     },
//     isAdmin:{
//         type:String
//     },
//     profileImage:{
//          type : String
//     },
//     isSuperAdmin:{
//         type:String
//     },
//     orders: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Order'
//     }],
//     savedProducts: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product'
//     }],
//     lastOtpId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'OTP'
//           },
//     blackList:[]
// }, {timestamps: true})

// // Add case-insensitive index to the email field
// userSchema.index({ email: 1 }, { unique: true, collation: { locale: 'en', strength: 1 } });

// const userModel = mongoose.model('User', userSchema);

// module.exports = userModel


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.isGoogleUser; // Password required only for normal signup
    },
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  isGoogleUser: {
    type: Boolean,
    default: false, // true if signed up with Google
  },
  googleId: {
    type: String, // Google user ID
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
    lastOtpId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'OTPS'
        },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
  savedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
}, { timestamps: true });

// Case-insensitive unique email
userSchema.index(
  { email: 1 },
  { unique: true, collation: { locale: 'en', strength: 1 } }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
