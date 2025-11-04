require('dotenv').config();
const NewmarchModel = require('../models/NewmarChModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../helpers/sendMail');
const OTP = require('../models/otpModel');
const otpGenerator = require('otp-generator');
const cloudinary = require(`../untils/cloudinary`);
const fs = require(`fs`);
const mongoose = require(`mongoose`)
const { signUpTemplate, forgotPasswordTemplate } = require('../helpers/emailTemplate');
// const workerModel = require('../models/workerModel');


// user sign up
exports.MarchantSignup = async (req, res) => {
    try {
        const { email, password, fullName, description, businessName, phoneNumber} = req.body
        const file = req.files.profileImage;
        if (!email || !password  || !fullName ||  !description ||!businessName || !phoneNumber) {
            return res.status(400).json({
                message: `Please enter all details`
            })
        }

        const emailExists = await NewmarchModel.findOne({ email: email.toLowerCase() })

        if (emailExists) {
            return res.status(400).json({
                message: `Email already exist.`
            })
        }

        // salt the password using bcrypt
        const salt = bcrypt.genSaltSync(10)
        // hash the salted password using bcrypt
        const hashedPassword = bcrypt.hashSync(password, salt);

        const image = await cloudinary.uploader.upload(file.tempFilePath);
    fs.unlink(file.tempFilePath, (err) => {
      if (err) {
        console.log("Failed to delete the file locally:", err);
      }
    });

        // create a user
        const user = new NewmarchModel({
            email:email.toLowerCase(),
            phoneNumber,
            description,
            password: hashedPassword,
            fullName,
            profileImage: image.secure_url,
        });

        // Generate OTP
        const otp = otpGenerator.generate(4, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        console.log(otp);

        // Create an OTP instance associated with the user
        const otpInstance = await OTP.create({
            otp,
            user: user._id,
        });

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
        },
            process.env.JWT_SECRET, { expiresIn: "7d" })

        user.lastOtpId = otpInstance._id;
        user.token = token;

        // send verification email
        const mailOptions = {
            email: user.email,
            subject: "Verify your account",
            html: signUpTemplate(otp, user.fullName),
        };

        
        // save the user
        await user.save();
        await sendMail(mailOptions);

        // return a response
        res.status(201).json({
            message: `Check your email: ${user.email} to verify your account.`,
            data: user
        })

    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error (E11000)
            const duplicateField = Object.keys(error.keyPattern)[0]; // Get the duplicate field (e.g., email)
            return res.status(400).json({ message: `A user with this ${duplicateField} already exists.` });
        }
        res.status(500).json({message: error.message});
      
    }
}




// verify email
exports.MarchantverifyEmail = async (req, res) => {
    try {
        const { otp } = req.body;
        const { token } = req.params;

        if (!otp) {
            return res.status(400).json({
                message: "Please enter OTP"
            });
        }
        if (!token) {
            return res.status(404).json({
                message: "Token not found"
            });
        }

        // Verify the token and extract the user's email
        const { email } = jwt.verify(token, process.env.JWT_SECRET);

        // Retrieve user from the database based on the email
        const user = await NewmarchModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check if the user has already been verified
        if (user.isVerified) {
            return res.status(400).json({
                message: "User already verified"
            });
        }

        // Retrieve the stored OTP document based on the user otp input
        const storedOtp = await OTP.findOne({ otp: otp });

        if (!storedOtp) {
            return res.status(404).json({
                message: 'Invalid OTP'
            });
        }

        // Compare the user-entered OTP with the stored OTP
        if (storedOtp._id.toString() === user.lastOtpId.toString()) {
            user.isVerified = true;
            await user.save();

            return res.status(200).json({
                message: "Email verification successful. You can now log in.",
                data: user.isVerified,
            });
        } else {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }
        // res.status( 200 ).redirect( `${req.protocol}://${req.get("host")}/api/log-in` );

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError){
            return res.status(404).json({
                message: "Session timed-out."
            });
        }
        res.status(500).json({
            message: error.message
        })
    }
}




exports.ResendMarchantVerificationEmail = async (req, res) => {
    try {
        // Extract token from request headers (assuming it's sent in the Authorization header)
        const { token } = req.params;  // Alternatively, you can use req.headers.authorization if passed in headers

        if (!token) {
            return res.status(400).json({
                error: "Token not provided"
            });
        }

        // Verify the token and extract the email
        const { email } = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by email
        const user = await NewmarchModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        // Check if the user is already verified
        if (user.isVerified) {
            return res.status(400).json({
                error: "User already verified"
            });
        }

        // Generate a new OTP (4 digits)
        const otp = otpGenerator.generate(4, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        console.log(`Generated OTP: ${otp}`);

        // Create an OTP instance associated with the user
        const otpInstance = await OTP.create({
            otp,
            user: user._id,
        });

        // Update the user's lastOtpId with the new OTP's _id
        user.lastOtpId = otpInstance._id;

        // Send the verification email with the OTP
        const mailOptions = {
            email: user.email,
            subject: "Verify your account",
            html: signUpTemplate(otp), // Your email template for OTP
        };

        // Save the user after updating the lastOtpId
        await user.save();

        // Send the email with the OTP
        await sendMail(mailOptions);

        // Respond with a success message
        res.status(200).json({
            message: `Verification email sent successfully to your email: ${user.email}`
        });

    } catch (error) {
        // Handle errors, especially token verification failures
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                error: "Invalid or expired token"
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
};




// Forgot Password
exports.MarchantforgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(404).json({
                message: "Please enter email address"
            });
        }

        // Check if the email exists in the MarchantModel
        const user = await NewmarchModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Generate OTP
        const otp = otpGenerator.generate(4, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        console.log(otp);

        // Create an OTP instance associated with the user
        const otpInstance = await OTP.create({
            otp,
            user: user._id,
        });

        user.lastOtpId = otpInstance._id;

        // create a token
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "30 mins" });


        // Send reset password email
        const mailOptions = {
            email: user.email,
            subject: "Password reset OTP",
            html: forgotPasswordTemplate(otp, user.fullName),
        };;

        await user.save();
        await sendMail(mailOptions);

        res.status(200).json({
            message: "Password reset email sent successfully",
            token
        });
    } catch (error) {
        console.error("Something went wrong", error.message);
        res.status(500).json({
            message: error.message
        });
    }
};

// verify email
exports.MarchantverifyEmailOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const { token } = req.params;

        if (!otp) {
            return res.status(400).json({
                message: "Please enter OTP"
            });
        }
        if (!token) {
            return res.status(404).json({
                message: "Token not found"
            });
        }

        // Verify the token and extract the user's email
        const { email } = jwt.verify(token, process.env.JWT_SECRET);

        // Retrieve user from the database based on the email
        const user = await NewmarchModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Retrieve the stored OTP document based on the user otp input
        const storedOtp = await OTP.findOne({ otp: otp });

        if (!storedOtp) {
            return res.status(404).json({
                message: 'Invalid OTP'
            });
        }

        // Compare the user-entered OTP with the stored OTP
        if (storedOtp._id.toString() === user.lastOtpId.toString()) {
            return res.status(200).json({
                message: "Verification successful. Please proceed to input your new password."
            });
        } else {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }
        // res.status( 200 ).redirect( `${req.protocol}://${req.get("host")}/api/log-in` );

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(404).json({
                message: "Session timed-out."
            });
        }
        res.status(500).json({
            message: error.message
        })
    }
}
//Make user to resend otp for forget password
exports.resendMarchantForgotPasswordOTP = async (req, res) => {
    try {
        // Extract the token from the request parameters
        const { token } = req.params;

        if (!token) {
            return res.status(404).json({
                message: "Token not provided"
            });
        }

        // Verify the token to get the user's email
        const { email } = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user in the database
        const user = await NewmarchModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Generate a new OTP
        const otp = otpGenerator.generate(4, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        console.log(otp);

        // Create a new OTP instance and associate it with the user
        const otpInstance = await OTP.create({
            otp,
            user: user._id,
        });

        // Update the user's lastOtpId with the new OTP instance
        user.lastOtpId = otpInstance._id;

        // Create a new token (optional, in case you want to refresh the token)
        const newToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "30 mins" });

        // Send the OTP again via email
        const mailOptions = {
            email: user.email,
            subject: "Resend: Password reset OTP",
            html: forgotPasswordTemplate(otp, user.fullName),
        };

        await user.save();  // Save the updated user details
        await sendMail(mailOptions);  // Send the email with the new OTP

        res.status(200).json({
            message: "OTP resent successfully",
            token: newToken  // Optional: if you want to return the new token
        });

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        console.error("Error in resending OTP", error.message);
        res.status(500).json({
            message: error.message
        });
    }
};


// Reset Password
exports.MarchantresetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Verify the user's token
        // if (!mongoose.Types.ObjectId.isValid(token)) {
            // return res.status(400).json({ message: 'Invalid ID format.' });}
        const { email } = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID
        const user = await NewmarchModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Salt and hash the new password
        const saltedRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltedRound);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: "Password reset successful"
        });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(404).json({
                message: "Session timed-out."
            });
        }
        console.error("Something went wrong", error.message);
        res.status(500).json({
            message: error.message
        });
    }
};





// User login
exports.MarchantLogin = async (req, res) => {
    try {
        // Extract the user's email and password
        const { password, email } = req.body;

        // find user by their registered email or username
        const checkUser = await NewmarchModel.findOne({ email: email.toLowerCase() })

        // check if the user exists
        if (!checkUser) {
            return res.status(404).json({
                Failed: 'User not found'
            })
        }

        // Compare user's password with the saved password.
        const checkPassword = bcrypt.compareSync(password, checkUser.password)
        // Check for password error
        if (!checkPassword) {
            return res.status(404).json({
                message: 'Invalid password'
            })
        }

        // Check if the user if verified
        if (!checkUser.isVerified) {
            return res.status(404).json({
                message: `User with this email: ${email} is not verified.`
            })
        }

        const token = jwt.sign({
            userId: checkUser._id,
            email: checkUser.email,

        },
            process.env.JWT_SECRET, { expiresIn: "7 days" })

        checkUser.token = token

        checkUser.save()

        res.status(200).json({
            message: 'Login successful',
            data: checkUser

        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}





// Change Password
exports.MarchantchangePassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, existingPassword } = req.body;

        // Verify the user's token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Get the user's Id from the token
        const userId = decodedToken.userId;

        // Find the user by ID
        const user = await NewmarchModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Confirm the previous password
        const isPasswordMatch = await bcrypt.compare(existingPassword, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Existing password does not match"
            });
        }

        // Salt and hash the new password
        const saltedRound = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltedRound);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            message: "Password changed successful"
        });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(404).json({
                message: "Session timed-out."
            });
        }
        console.error("Something went wrong", error.message);
        res.status(500).json({
            message: error.message
        });
    }
};




// User sign out
exports.MarchantsignOut = async (req, res) => {
    try {
        const { userId } = req.params;

        // Update the user's token to null
        let user = await NewmarchModel.findByIdAndUpdate(userId, { token: null }, { new: true });


        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        return res.status(200).json({
            message: 'User logged out successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
// exports.Marchantedit = async (req, res) => {
//     try {
//         const { merchantId } = req.params; // User ID from the request
//         const { email, fullName, description, phoneNumber } = req.body;
//         const file = req.files?.profileImage;
//       // User ID from the request
//         if (!mongoose.Types.ObjectId.isValid(merchantId)) {
//             return res.status(400).json({ message: 'Invalid ID format.' });}
//         // Find 
//         // Find the user by ID
//         const user = await NewmarchModel.findById(merchantId);

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Update fields if provided
//         if (email) user.email = email.toLowerCase();
//         if (fullName) user.fullName = fullName;
//         if (description) user.description = description;
//         if (phoneNumber) user.phoneNumber = phoneNumber;

//         // Handle profile image upload if a new one is provided
//         if (file) {
//             const image = await cloudinary.uploader.upload(file.tempFilePath);
//             user.profileImage = image.secure_url;

//             // Clean up local temporary file
//             fs.unlink(file.tempFilePath, (err) => {
//                 if (err) console.log("Failed to delete the file locally:", err);
//             });
//         }

//         // Save updated user
//         await user.save();

//         res.status(200).json({
//             message: "User details updated successfully",
//             data: user,
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const updateMerchant = async (req, res) => {
    try {
        const { merchantId } = req.params;
        const { businessName, phoneNumber, address, description } = req.body;
        
        // Ensure the merchant exists
        const merchant = await merchModel.findById(merchantId);
        if (!merchant) {
            return res.status(404).json({ message: 'Merchant not found' });
        }

        // If a file is uploaded, handle the file upload to Cloudinary
        if (req.files && req.files.profileImage) {
            const file = req.files.profileImage;
            
            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(file.tempFilePath);

            // Assign the new profile image URL
            merchant.profileImage = result.secure_url;

            // Delete the temp file
            fs.unlinkSync(file.tempFilePath);
        }

        // Update other merchant details
        merchant.businessName = businessName || merchant.businessName;
        merchant.phoneNumber = phoneNumber || merchant.phoneNumber;
        merchant.address = address || merchant.address;
        merchant.description = description || merchant.description;

        // Save the updated merchant
        await merchant.save();

        res.status(200).json({ message: 'Merchant profile updated successfully', data: merchant });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getAllMerchants = async(req,res)=>{
    try {
        /// find all merchants from the DB
     const merchants = await merchModel.find()

     if(merchants.length <= 0){
        return res.status(404).json(`No available merchants.`)
     }else{
        res.status(200).json({message:`Kindly find the ${merchants.length} registered merchants below`, data: merchants})
     }
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


exports.getOneMerchant = async (req, res) => {

    try {
        const {merchantId} = req.params
        if (!mongoose.Types.ObjectId.isValid(merchantId)) {
            return res.status(400).json({ message: 'Invalid ID format.' });}
        const merchant = await NewmarchModel.findById(merchantId)
        if(!merchant){
            return res.status(404).json(`Business not found.`)
        }
        res.status(200).json({
            message: `Business found.`,
            data: merchant
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.deleteMerchant = async (req, res) => {
    try {
      const { merchantId } = req.params;
  
      // Validate the merchantId
      if (!mongoose.Types.ObjectId.isValid(merchantId)) {
        return res.status(400).json({ message: "Invalid Merchant ID format." });
      }
  
      // Find the merchant by ID
      const merchant = await merchModel.findById(merchantId);
      if (!merchant) {
        return res.status(404).json({ message: "Merchant not found." });
      }
  
      // Delete products and orders related to the merchant
       await productModel.deleteMany({ _id: { $in: merchant.products } });
       await orderModel.deleteMany({ _id: { $in: merchant.orders } });
  
      // Remove merchant's profile image from Cloudinary (if applicable)
      if (merchant.profileImage) {
        await cloudinary.uploader.destroy(merchant.profileImage);
      }
  
      // Delete the merchant
      await merchModel.findByIdAndDelete(merchantId);
  
      // Respond with a success message
      res.status(200).json({ message: "Merchant deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

