// const UserModel = require(`../models/userModel`)
// // d9H4oe3MsLDQ6TN0
// const bcrypt = require(`bcrypt`)
// const jwt = require(`jsonwebtoken`)
// const mongoose = require(`mongoose`)
// const sendMail = require(`../helpers/email.js`);
// const {
//     signUpTemplate,
//     verifyTemplate,
//     forgotPasswordTemplate,
//     passwordChangeTemplate,
// } = require(`../helpers/html.js`);


// const userSignUp = async (req, res) => {
//     try {

//         const { fullName, email, password, phoneNumber} = req.body;
//         if(!fullName || !email || !password || !phoneNumber ){
//             return res.status(400).json(`Please enter all fields.`)
//         }
//         const emailExist = await userModel.findOne({ email: email.toLowerCase() });
//         if (emailExist) {
//             return res.status(400).json(`User with email already exist.`);
//         } else {
//             //perform an encryption using salt
//             const saltedPassword = await bcrypt.genSalt(10);
//             //perform an encrytion of the salted password
//             const hashedPassword = await bcrypt.hash(password, saltedPassword);
//             // create object of the body
//             const user = new userModel({
//                 fullName,
//                 email: email.toLowerCase(),
//                 password: hashedPassword,
//                 phoneNumber
//             });

//             const userToken = jwt.sign(
//                 { id: user._id, email: user.email },
//                 process.env.jwt_secret,
//                 { expiresIn: "10 Minutes" }
//             );
//             const verifyLink = `${req.protocol}://${req.get(
//                 "host"
//             )}/api/v1/verify/${userToken}`;
    
//             await user.save();
//             await sendMail({
//                 subject: `Email Verification`,
//                 email: user.email,
//                 html: signUpTemplate(verifyLink, user.fullName),
//             });
//             res.status(201).json({
//                 message: `Welcome ${user.fullName}, kindly check your mail to access the link to verify your email`,
//                 data: user,
//             });
//         }
//     } catch (error) {
//         if (error.code === 11000) {
//             // Handle duplicate key error (E11000)
//             const duplicateField = Object.keys(error.keyPattern)[0]; // Get the duplicate field (e.g., email)
//             return res.status(400).json({ message: `A user with this ${duplicateField} already exists.` });
//         }
//         res.status(500).json({
//             message: error.message,
//         });
//     }
// };

// const verifyEmail = async (req, res) => {
//     try {
//         // Extract the token from the request params
//         const { token } = req.params;
//         // Extract the email from the verified token
//         const { email } = jwt.verify(token, process.env.jwt_secret);
//         // Find the user with the email
//         const user = await userModel.findOne({ email:email.toLowerCase() });
//         // Check if the user is still in the database
//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found",
//             });
//         }
//         // Check if the user has already been verified
//         if (user.isVerified) {
//             return res.status('201').json({
//                 message: "User Verif found",
//             });
//         }
//         // Verify the user
//         user.isVerified = true;
//         // Save the user data
//         await user.save();
//         // Send a success response
//         return res.redirect('https://groceria-app.onrender.com//#/congrat')
//     } catch (error) {
//         if (error instanceof jwt.JsonWebTokenError) {
//            return res.status("401").json('expired')
//         }
//         res.status(500).json({
//             message: error.message,
//         });
//     }
// };

// const userLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if( !email || !password ){
//             return res.status(400).json(`Please enter all fields (email & pasword).`)
//         }
//         const existingUser = await userModel.findOne({email: email.toLowerCase()});
//         if (!existingUser) {
//             return res.status(404).json({
//                 message: "User not found."}); }

//         const confirmPassword = await bcrypt.compare(password,existingUser.password);
//         if (!confirmPassword) {
//             return res.status(404).json({
//                 message: "Incorrect Password." });}
//         if (existingUser.isVerified === false) {
//             return res.status(400).json({
//                 message:
//                     "User not verified, Please check you email to verify your account.",
//             });
//         }

//         const token = await jwt.sign(
//             {
//                 userId: existingUser._id,
//                 email: existingUser.email,
//             },
//             process.env.jwt_secret,
//             { expiresIn: "3h" }
//         );
//         res.status(200).json({
//             message: "User logged in successfully",
//             data: existingUser,
//             token,
//         });
    
//     } catch (error) {
//         res.status(500).json({
//             message: error.message,
//         });
//     }
// };

// const resendVerificationEmail = async (req, res) => {
//     try {
//         const { email } = req.body;
//         if (!email) {
//             return res.status(400).json({ message: "Email is required." });
//         }
//         // Find the user with the email
//         const user = await userModel.findOne({ email:email.toLowerCase() });
//         // Check if the user is still in the database
//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found."
//             });
//         }

//         // Check if the user has already been verified
//         if (user.isVerified) {
//             return res.redirect('https://groceria-app.onrender.com//#/congrat')
//         }

//         const token = jwt.sign({ email: user.email }, process.env.jwt_secret, {
//             expiresIn: "20mins"
//         });
//         const verifyLink = `${req.protocol}://${req.get(
//             "host"
//         )}/api/v1/verify/${token}`;
//         let mailOptions = {
//             email: user.email,
//             subject: "Verification email",
//             html: verifyTemplate(verifyLink, user.fullName),
//         };
//         // Send the the email
//         await sendMail(mailOptions);
//         // Send a success message
//         res.status(200).json({
//             message: "Verification email resent successfully.",
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: error.message,
//         });
//     }
// };

// const forgotPassword = async (req, res) => {
//     try {
//         // Extract the email from the request body
//         const { email } = req.body;

//         // Check if email is provided
//         if (!email) {
//             return res.status(400).json({ message: "Email is required." });
//         }

//         // Convert email to lowercase and check if the email exists in the database
//         const user = await userModel.findOne({ email: email.toLowerCase() });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Generate a reset token
//         const resetToken = jwt.sign({ email: user.email }, process.env.jwt_secret, {
//             expiresIn: "30m",
//         });
//         const resetLink = `${req.protocol}://${req.get("host")}/api/v1/reset-password/${resetToken}`;

//         // Send reset password email
//         const mailOptions = {
//             email: user.email,
//             subject: "Password Reset",
//             html: forgotPasswordTemplate(resetLink, user.fullName),
//         };
//         // Send the email
//         await sendMail(mailOptions);

//         // Send a success response
//         res.status(200).json({ message: "Password reset email sent successfully." });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const resetPassword = async (req, res) => {
//     try {
//         const { token } = req.params;
//         const { password } = req.body;

//         // Verify the user's token and extract the user's email from the token
//         const { email } = jwt.verify(token, process.env.jwt_secret);

//         // Find the user by ID
//         const user = await userModel.findOne({ email:email.toLowerCase() });
//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found",
//             });
//         }

//         // Salt and hash the new password
//         const saltedRound = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, saltedRound);

//         // Update the user's password
//         user.password = hashedPassword;
//         // Save changes to the database
//         await user.save();
//         // Send a success response
//         res.status(200).json({
//             message: "Password reset successful",
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: error.message,
//         });
//     }
// };

// const changePassword = async (req, res) => {
//     try {
//         const { token } = req.params;
//         const { newPassword, existingPassword } = req.body;
//         if( !newPassword || !existingPassword ){
//             return res.status(400).json(`Please enter all fields (New Password & Existing pasword).`)
//         }
//         // Verify the user's token and extract the user's email from the token
//         const { email } = jwt.verify(token, process.env.jwt_secret);

//         // Find the user by ID
//         const user = await userModel.findOne({ email: email.toLowerCase() });
//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found.",
//             });
//         }

//         // Confirm the previous password
//         const isPasswordMatch = await bcrypt.compare(
//             existingPassword,
//             user.password
//         );
//         if (!isPasswordMatch) {
//             return res.status(401).json({
//                 message: "Existing password does not match.",
//             });
//         }

//         // Salt and hash the new password
//         const saltedRound = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(newPassword, saltedRound);

//         // Update the user's password
//         user.password = hashedPassword;
//         // Save the changes to the database
//         await user.save();
//         let mailOptions = {
//             email: user.email,
//             subject: "Password Changed",
//             html: passwordChangeTemplate(user.fullName),
//         };
//         // Send the the email
//         await sendMail(mailOptions);
//         //   Send a success response
//         res.status(200).json({
//             message: "Password changed successfully.",
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: error.message,
//         });
//     }
// };

// const makeAdmin = async(req, res)=> {
//     try {
//         const {userId} = req.params
//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//             return res.status(400).json({ message: 'Invalid ID format.' });}
//         const user = await userModel.findById(userId)
//         if(!user){
//             return res.status(404).json(`User with ID: ${userId} was not found`)
//         }
//         user.isAdmin = true
//         await user.save()
//         res.status(200).json({message: `Dear ${user.fullName}, you're now an admin`, data: user})
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// }

// const makeSuperAdmin = async(req, res)=> {
//     try {
//         const {userId} = req.params
//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//             return res.status(400).json({ message: 'Invalid ID format.' });}
//         const user = await userModel.findById(userId)
//         if(!user){
//             return res.status(404).json(`User with ID ${userId} was not found`)
//         }
//         user.isSuperAdmin = true
//         await user.save()
//         res.status(200).json({message: `Dear ${user.fullName}, you're now a Super Admin`, data: user})
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// }

// const getOneUser = async (req, res) => {
//     try {
//         const {userId} = req.params
//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//             return res.status(400).json({ message: 'Invalid ID format.' });}
//         const user = await userModel.findById(userId)
//         if(!user){
//             return res.status(404).json(`User not found.`)
//         }
//         res.status(200).json({
//             message: `Dear ${user.fullName}, kindly find your information below:`,
//             data: user
//         })
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// }

// const getAllUsers = async(req,res)=>{
//     try {
//      const users = await userModel.find()
//      if(users.length <= 0){
//         return res.status(404).json(`No available users`)
//      }else{
//         res.status(200).json({message:`Kindly find the ${users.length} registered users below`, data: users})
//      }
        
//     } catch (error) {
//         res.status(500).json(error.message)
//     }
// }

// const userLogOut = async (req, res) => {
//     try {
//         // Check if authorization header exists
//         const auth = req.headers.authorization;
//         if (!auth || !auth.startsWith('Bearer ')) {
//             return res.status(401).json({ message: 'Authorization header missing or malformed.' });
//         }

//         // Extract token from the authorization header
//         const token = auth.split(' ')[1];

//         if (!token) {
//             return res.status(401).json({ message: 'Token missing in authorization header.' });
//         }

//         // Verify the user's token
//         let decoded;
//         try {
//             decoded = jwt.verify(token, process.env.jwt_secret);
//         } catch (err) {
//             return res.status(401).json({ message: 'Invalid or expired token.' });
//         }

//         // Find the user by email
//         const { email } = decoded;
//         const user = await userModel.findOne({ email: email.toLowerCase() });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         // Add token to the blacklist (ensure `blackList` exists in user schema)
//         user.blackList = user.blackList || []; // Initialize if not present
//         if (!user.blackList.includes(token)) {
//             user.blackList.push(token); // Add token to blacklist if not already present
//         }

//         // Save the changes to the database
//         await user.save();

//         // Send a success response
//         res.status(200).json({ message: 'User logged out successfully.' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// module.exports ={
//     userSignUp, verifyEmail, resendVerificationEmail, userLogin, resetPassword, forgotPassword, changePassword, makeAdmin, makeSuperAdmin, getOneUser, getAllUsers, userLogOut
// }
require('dotenv').config();
const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../helpers/sendMail');
const OTP = require('../models/UserOTP');
const otpGenerator = require('otp-generator');
const cloudinary = require(`../untils/cloudinary`);
const fs = require(`fs`);
const mongoose = require(`mongoose`)
const { signUpTemplate, forgotPasswordTemplate } = require('../helpers/emailTemplate');
// const workerModel = require('../models/workerModel');


// user sign up
exports.UserSignUp = async (req, res) => {
    try {
        const { email, password, fullName, address, phoneNumber} = req.body
        const file = req.files.profileImage;
        if (!email || !password  || !fullName ||  !address || !phoneNumber) {
            return res.status(400).json({
                message: `Please enter all details`
            })
        }

        const emailExists = await UserModel.findOne({ email: email.toLowerCase() })

        if (emailExists) {
            return res.status(400).json({
                message: `Email already exist.`
            })
        }

              const image = await cloudinary.uploader.upload(file.tempFilePath);
            fs.unlink(file.tempFilePath, (err) => {
              if (err) {
                console.log("Failed to delete the file locally:", err);
              }
            });
 
    const salt = bcrypt.genSaltSync(10)
    // hash the salted password using bcrypt
    const hashedPassword = bcrypt.hashSync(password, salt);
    // }
  
        // create a user
        const user = new UserModel({
            email:email.toLowerCase(),
            phoneNumber,
            password: hashedPassword,
            fullName,
            address,
            profileImage: image.secure_url,

            // profileImage: profilePictureUrl,

            // profileImage: image?.secure_url,

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
            process.env.JWT_SECRET, { expiresIn: "10 mins" })

        user.lastOtpId = otpInstance._id;
        user.token = token;
        console.log(token)

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
            token,
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
exports.UserVerifyEmail = async (req, res) => {
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
        const user = await UserModel.findOne({ email: email.toLowerCase() });

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




exports.UserResendVerifyone = async (req, res) => {
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
        const user = await UserModel.findOne({ email: email.toLowerCase() });

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
exports.UserforgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(404).json({
                message: "Please enter email address"
            });
        }

        // Check if the email exists in the MarchantModel
        const user = await UserModel.findOne({ email: email.toLowerCase() });
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
exports.UserverifypassEmailOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const { token } = req.params;

    // 1️⃣ Validate inputs
    if (!otp) {
      return res.status(400).json({ message: "Please enter OTP" });
    }
    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }

    // 2️⃣ Verify token → get user email
    const { email } = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Get user
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4️⃣ Get stored OTP
    const storedOtp = await OTP.findOne({ otp });
    if (!storedOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 5️⃣ Defensive checks
    if (!storedOtp._id || !user.lastOtpId) {
      return res.status(400).json({
        message: "OTP verification failed. Please request a new code.",
      });
    }

    // 6️⃣ Compare OTP IDs
    if (storedOtp._id.toString() === user.lastOtpId.toString()) {
      return res.status(200).json({
        message: "Verification successful. Please proceed to input your new password.",
      });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }

  } catch (error) {
    console.error("OTP Verification Error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Session expired or invalid token." });
    }

    res.status(500).json({
      message: error.message || "Server error during OTP verification.",
    });
  }
};

//Make user to resend otp for forget password
exports.resendUserForgotPasswordOTP = async (req, res) => {
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
        const user = await UserModel.findOne({ email: email.toLowerCase() });
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
exports.UserresetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Verify the user's token
        if (!token) {
            return res.status(400).json({ message: 'Invalid ID format.' });}
        const { email } = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID
        const user = await UserModel.findOne({ email });
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
exports.UserLogin = async (req, res) => {
    try {
        // Extract the user's email and password
        const { password, email } = req.body;

        // find user by their registered email or username
        const checkUser = await UserModel.findOne({ email: email.toLowerCase() })

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
            token,
            data: checkUser

        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}





// Change Password
exports.UserchangePassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, existingPassword } = req.body;

        // Verify the user's token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Get the user's Id from the token
        const userId = decodedToken.userId;

        // Find the user by ID
        const user = await UserModel.findById(userId);
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
exports.UsersignOut = async (req, res) => {
    try {
        const { userId } = req.params;

        // Update the user's token to null
        let user = await UserModel.findByIdAndUpdate(userId, { token: null }, { new: true });


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
//         const user = await UserModel.findById(merchantId);

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

exports.UserUpdataProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { address, fullName, phoneNumber } = req.body;
        
        // Ensure the merchant exists
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Merchant not found' });
        }

        // If a file is uploaded, handle the file upload to Cloudinary
        if (req.files && req.files.profileImage) {
            const file = req.files.profileImage;
            
            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(file.tempFilePath);

            // Assign the new profile image URL
            user.profileImage = result.secure_url;

            // Delete the temp file
            fs.unlinkSync(file.tempFilePath);
        }

        // Update other merchant details
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.fullName = fullName || user.fullName;
        user.address = address || user.address;

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'user profile updated successfully', data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// exports.getAllUsers = async(req,res)=>{
//     try {
//         /// find all users from the DB
//      const merchants = await UserModel.find()

//      if(merchants.length <= 0){
//         return res.status(404).json(`No available merchants.`)
//      }else{
//         res.status(200).json({message:`Kindly find the ${merchants.length} registered merchants below`, data: merchants})
//      }
        
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// }


// exports.getOneUsers = async (req, res) => {

//     try {
//         const {merchantId} = req.params
//         if (!mongoose.Types.ObjectId.isValid(merchantId)) {
//             return res.status(400).json({ message: 'Invalid ID format.' });}
//         const merchant = await UserModel.findById(merchantId)
//         if(!merchant){
//             return res.status(404).json(`Business not found.`)
//         }
//         res.status(200).json({
//             message: `Business found.`,
//             data: merchant
//         })
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// }

// exports.deleteUsers = async (req, res) => {
//     try {
//       const { userId } = req.params;
  
//       // Validate the merchantId
//       if (!mongoose.Types.ObjectId.isValid(userId)) {
//         return res.status(400).json({ message: "Invalid Merchant ID format." });
//       }
  
//       // Find the merchant by ID
//       const user = await UserModel.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: "Merchant not found." });
//       }
  
//       // Delete products and orders related to the merchant
//        await productModel.deleteMany({ _id: { $in: merchant.products } });
//        await orderModel.deleteMany({ _id: { $in: merchant.orders } });
  
//       // Remove merchant's profile image from Cloudinary (if applicable)
//       if (merchant.profileImage) {
//         await cloudinary.uploader.destroy(merchant.profileImage);
//       }
  
//       // Delete the merchant
//       await UserModel.findByIdAndDelete(merchantId);
  
//       // Respond with a success message
//       res.status(200).json({ message: "Merchant deleted successfully." });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
  


 exports.makeAdmin = async(req, res)=> {
    try {
        const {userId} = req.params
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid ID format.' });}
        const user = await UserModel.findById(userId)
        if(!user){
            return res.status(404).json(`User with ID: ${userId} was not found`)
        }
        user.isAdmin = true
        await user.save()
        res.status(200).json({message: `Dear ${user.fullName}, you're now an admin`, data: user})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.makeSuperAdmin = async(req, res)=> {
    try {
        const {userId} = req.params
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid ID format.' });}
        const user = await UserModel.findById(userId)
        if(!user){
            return res.status(404).json(`User with ID ${userId} was not found`)
        }
        user.isSuperAdmin = true
        await user.save()
        res.status(200).json({message: `Dear ${user.fullName}, you're now a Super Admin`, data: user})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

// exports.getOneUser = async (req, res) => {
//     try {
//         const {userId} = req.params
//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//             return res.status(400).json({ message: 'Invalid ID format.' });}
//         const user = await UserModel.findById(userId)
//         if(!user){
//             return res.status(404).json(`User not found.`)
//         }
//         res.status(200).json({
//             message: `Dear ${user.fullName}, kindly find your information below:`,
//             data: user
//         })
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// }
// exports.getOneUser = async (req, res) => {
//   try {
//     const { id } = req.params; // ✅ match the router
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Invalid ID format.' });
//     }

//     const user = await UserModel.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     res.status(200).json({
//       message: `Dear ${user.fullName}, kindly find your information below:`,
//       data: user,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.getOneUser = async (req, res) => {

    try {
        const {userId} = req.params
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid ID format.' });}
        const user = await UserModel.findById(userId)
        if(!user){
            return res.status(404).json(`User not found.`)
        }
        res.status(200).json({
            message: `User found.`,
            data: user
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.getAllUsers = async(req,res)=>{
    try {
     const users = await UserModel.find()
     if(users.length <= 0){
        return res.status(404).json(`No available users`)
     }else{
        res.status(200).json({message:`Kindly find the ${users.length} registered users below`, data: users})
     }
        
    } catch (error) {
        res.status(500).json(error.message)
    }
}

exports.userLogOut = async (req, res) => {
    try {
        // Check if authorization header exists
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header missing or malformed.' });
        }

        // Extract token from the authorization header
        const token = auth.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token missing in authorization header.' });
        }

        // Verify the user's token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.jwt_secret);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }

        // Find the user by email
        const { email } = decoded;
        const user = await UserModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Add token to the blacklist (ensure `blackList` exists in user schema)
        user.blackList = user.blackList || []; // Initialize if not present
        if (!user.blackList.includes(token)) {
            user.blackList.push(token); // Add token to blacklist if not already present
        }

        // Save the changes to the database
        await user.save();

        // Send a success response
        res.status(200).json({ message: 'User logged out successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteUsers = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Validate the merchantId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid Merchant ID format." });
      }
  
      // Find the merchant by ID
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Merchant not found." });
      }
  
      // Delete products and orders related to the merchant
       await productModel.deleteMany({ _id: { $in: user.products } });
       await orderModel.deleteMany({ _id: { $in: user.orders } });
  
      // Remove merchant's profile image from Cloudinary (if applicable)
      if (user.profileImage) {
        await cloudinary.uploader.destroy(user.profileImage);
      }
  
      // Delete the merchant
      await UserModel.findByIdAndDelete(userId);
  
      // Respond with a success message
      res.status(200).json({ message: "Merchant deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  