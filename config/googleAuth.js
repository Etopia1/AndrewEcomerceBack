const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy( 
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://andrewecomerceback.onrender.com/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value.toLowerCase();
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            fullName: profile.displayName,
            email,
            profileImage: profile.photos?.[0]?.value || "",
            googleId: profile.id,
            isGoogleUser: true,
            isVerified: true,
          });
        } else {
          // Update if existing user wasn’t a Google user before
          if (!user.isGoogleUser) {
            user.isGoogleUser = true;
            user.googleId = profile.id;
            await user.save();
          }
        }

        // ✅ Create JWT token exactly like manual login
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.jwt_secret ,
          { expiresIn: "7d" }
        );

        user.token = token;
        await user.save();

        // ✅ Attach token to user before finishing Passport callback
        const userData = user.toObject();
        userData.token = token;

        done(null, userData);
      } catch (error) {
        console.error("Google Auth Error:", error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
