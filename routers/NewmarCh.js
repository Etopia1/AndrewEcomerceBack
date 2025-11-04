const express = require('express');
const { MarchantSignup, MarchantverifyEmailOTP, MarchantLogin,
getAllMarchant, Marchantedit, MarchantresetPassword, resendMarchantForgotPasswordOTP, MarchantverifyEmail,MarchantforgotPassword, ResendMarchantVerificationEmail} = require('../controllers/NewmarChcontroller');
// const { authenticateLogout } = require('../middleware/authorization');
const { getOneMerchant } = require("../controllers/NewmarChcontroller");

const midasValidator = require('../middlewares/validator')
 const authorize = require('../middlewares/Auth')
const router = express.Router();

router.post('/signUp', midasValidator(false), MarchantSignup)

router.post('/verifyone/:token', MarchantverifyEmail)

router.post('/resendverifyone/:token', ResendMarchantVerificationEmail)

router.post("/forgotPassword", midasValidator(false), MarchantforgotPassword);

router.post("/forgotPasswordverify/:token",  MarchantverifyEmailOTP);

router.post("/resendforgotPasswordverify/:token",  resendMarchantForgotPasswordOTP);

router.post("/resetpassword/:token", midasValidator(false),  MarchantresetPassword);
// router.route("/resetpassword/:token", midasValidator(false))
//     .post(MarchantresetPassword);
// router.route("/getOneMarchant/:merchantId",authorize, )
//     .get(getOneMarchant);
// router.route("/Marchantedit/:merchantId",authorize,  midasValidator )
//     .put(Marchantedit);

router.post("/Login",  MarchantLogin);   

// router.get("/getallMarchant",  getAllMarchant);

// router.get("/getOneMarchant",authorize,  getOneMarchant);

// router.get(`/merchant-getone/:merchantId`, getOneMarchant)
router.get("/merchant-getone/:merchantId", getOneMerchant);

// router.put("/Marchantedit/:merchantId", midasValidator(false), authorize, Marchantedit)




// router.route("/users/resendForgotPasswordOTP/:token")
//     .post(resendForgotPasswordOTP);

// router.route('/users/change-password/:token')
//     .post(changePassword);

// router.route('/users/reset-password/:token')
//     .post(resetPassword);

// router.route('/users/forgot-password')
//     .post(forgotPassword);

 module.exports = router;