const mongoose = require('mongoose')

const newmarchSchema = new mongoose.Schema({
    
    fullName: {
        type: String,
        require: true
    },
    businessName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true, // Store emails in lowercase
        trim: true, // Removes spaces before or after the email
    },
    password: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    address: {
        type: String,
    },
    description: {
    type: String
    },
    profileImage: {
    type: String
    },
    isVerified:{
        type:Boolean,
        default: false
    },
    isAdmin:{
        type:String,
        default: true
    },
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    // category:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Category"
    // }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    notifications: [{
        type: Object,
    }],
    lastOtpId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OTP'
      },
      token: {
        type: String,
        default: null
    },
    blackList:[]
}, {timestamps: true})

// Add case-insensitive index to the email field
newmarchSchema.index({ email: 1 }, { unique: true, collation: { locale: 'en', strength: 1 } });

const NewmarChModel = mongoose.models.NewmarChModel || mongoose.model('NewmarChModel', newmarchSchema);


module.exports = NewmarChModel