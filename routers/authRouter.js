const express = require("express");
const passport = require("passport");
require("../config/googleAuth");

const router = express.Router();

// Step 1: Google OAuth entry point
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google OAuth callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    // req.user now has user info and token
    const token = req.user.token;
    const userId = req.user._id;

    // Redirect to frontend with query params
    res.redirect(`http://localhost:5173/#/userlogin?token=${token}&userId=${userId}`);
  }
);

module.exports = router;
