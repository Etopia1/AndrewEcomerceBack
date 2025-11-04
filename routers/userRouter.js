// const express = require('express')
// const { isSuperAdmin, authenticate} = require(`../middlewares/Auth`)
// const {
//     userSignUp, verifyEmail, resendVerificationEmail, userLogin, resetPassword, forgotPassword, changePassword, makeAdmin, getOneUser, userLogOut,
//     getAllUsers,
//     makeSuperAdmin
// } = require('../controllers/userController')
// const midasValidator = require('../middlewares/validator')
// const { checkout, confirmOrder, getAllOrders } = require('../controllers/orderController')

// const router = express.Router()

// router.post('/sign-up', midasValidator(false), userSignUp)

// router.post(`/log-in`, midasValidator(false), userLogin)

// router.get(`/verify/:token`, verifyEmail)

// router.post(`/resend-verification`, midasValidator(false), resendVerificationEmail)

// router.post(`/forgot-password`, midasValidator(false), forgotPassword)

// router.post(`/change-password/:token`, midasValidator(false), authenticate, changePassword)

// router.post(`/reset-password/:token`, resetPassword)

// router.get(`/make-admin/:userId`, makeAdmin)

// router.get(`/make-super/:userId`, isSuperAdmin, makeSuperAdmin)

// router.get(`/getone/:userId`, getOneUser)

// router.get(`/getallusers`, isSuperAdmin, getAllUsers)

// router.get(`/checkout`, authenticate, checkout)

// router.post(`/place-order`, midasValidator(false), authenticate, confirmOrder)

// router.get(`/getorders`, authenticate, getAllOrders)

// router.post(`/log-out`, userLogOut)

// module.exports = router

const express = require('express');
const { UserSignUp, UserverifypassEmailOTP, makeAdmin, makeSuperAdmin, UserchangePassword,
getAllMarchant, Marchantedit, getOneUser, UserLogin, UserresetPassword, resendUserForgotPasswordOTP, UsersignOut, UserVerifyEmail,UserforgotPassword, UserResendVerifyone} = require('../controllers/userController');
// const { authenticateLogout } = require('../middleware/authorization');
const midasValidator = require('../middlewares/validator')
const { checkout, confirmOrder, getAllOrders } = require('../controllers/orderController')

const { isSuperAdmin, authenticate} = require(`../middlewares/Auth`)
// const upload = require('../untils/multer')

const router = express.Router();


router.post('/user-signUp', midasValidator(false), UserSignUp)

router.post('/user-verifyone/:token', UserVerifyEmail)

router.post('/user-resendverifyone/:token', UserResendVerifyone)

router.post("/user-forgotPassword", midasValidator(false), UserforgotPassword);

router.post("/user-forgotPasswordverify/:token",  UserverifypassEmailOTP);

router.post("/user-resendforgotPasswordverify/:token",  resendUserForgotPasswordOTP);

router.post("/user-resetpassword/:token", midasValidator(false),  UserresetPassword);
router.post("/user-login", UserLogin)
router.get(`/make-admin/:userId`, isSuperAdmin, makeAdmin)

router.get(`/make-super/:userId`, isSuperAdmin, makeSuperAdmin)
router.get(`/checkout`, authenticate, checkout)
router.get(`/getorders`, authenticate, getAllOrders)


router.get('/user-get/:userId', getOneUser);

// router.get(`/getallusers`, isSuperAdmin, getAllUsers)

router.post(`/change-password/:token`, midasValidator(false), authenticate, UserchangePassword)

router.post("/logout", UsersignOut)
// router.route("/resetpassword/:token", midasValidator(false))
//     .post(MarchantresetPassword);
// router.route("/getOneMarchant/:merchantId",authorize, )
//     .get(getOneMarchant);
// router.route("/UserEdit/:userId",authenticate,  midasValidator )
//     .put(UserUpdataProfile);

// router.post("/Login",  MarchantLogin);

// router.get("/getallMarchant",  getAllMarchant);

// router.get("/getOneMarchant",authorize,  getOneMarchant);

// router.get("/getOneMarchant/:merchantId",authorize, getOneMarchant);

// router.put("/Marchantedit/:merchantId", midasValidator(false), authorize, Marchantedit)



// "message": "Dear Andrew Jola, you're now a Super Admin",
// "data": {
//     "_id": "67658998ceeed9345211ff2f",
//     "fullName": "Andrew Jola",
//     "email": "norahezddperidbe@gmail.com",
//     "password": "$2b$10$B33PcjvUbc3A17fixZnMHuytjhBqQjh330LM51pKhM32hYJIDH6qG",
//     "phoneNumber": "09038730991",
//     "address": "120 Muyibi street olodi apapa lagos",
//     "isVerified": true,
//     "orders": [],
//     "savedProducts": [],
//     "blackList": [],
//     "lastOtpId": "67658bb35c3f72e3d814f368",
//     "createdAt": "2024-12-20T15:13:28.375Z",
//     "updatedAt": "2024-12-20T15:31:34.491Z",
//     "__v": 0,
//     "isAdmin": "true",
//     "isSuperAdmin": "true"
// }
// }



// router.route("/users/resendForgotPasswordOTP/:token")
//     .post(resendForgotPasswordOTP);

// router.route('/users/change-password/:token')
//     .post(changePassword);

// router.route('/users/reset-password/:token')
//     .post(resetPassword);

// router.route('/users/forgot-password')
//     .post(forgotPassword);

 module.exports = router;