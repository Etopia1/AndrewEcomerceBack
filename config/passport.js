// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/User');

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.ClientID,
//       clientSecret: process.env.ClientSecret,
//       callbackURL: '/auth/google/callback',
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ googleId: profile.id });

//         if (existingUser) return done(null, existingUser);

//         const newUser = await User.create({
//           googleId: profile.id,
//           name: profile.displayName,
//           email: profile.emails[0].value,
//           avatar: profile.photos[0].value,
//         });

//         return done(null, newUser);
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.ClientID,
			clientSecret: process.env.ClientSecret,
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},
		function (accessToken, refreshToken, profile, callback) {
			callback(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});