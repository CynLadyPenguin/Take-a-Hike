//todo 
// first i need to create a new project in google developers console
// then i will be given a client ID and client secret which must be provided to passport
// then i will need to configure a redirect URI with matches the rout in our application.
require('dotenv').config();
const { application } = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Users } = require('../database/models/users.js')



passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5555/auth/google/callback",
  passReqToCallback: true
},
  async (req, accessToken, refreshToken, profile, done) => {
  const defaultUser = {
    fullName: `${profile.name.givenName} ${profile.name.familyName}`,
    email: profile.emails[0].value,
    picture: profile.photos[0].value,
    googleId: profile.id,
  }
  try {
    const [user, created] = await Users.findOrCreate({ where: { googleId: profile.id }, defaults: defaultUser })

    // console.log(user.dataValues)
    const userData = user.dataValues;

    return done(null, userData);


  } catch (error) {
    console.error('Error during Google authentication:', error);
    return done(error);
  }

}
)); // This returned user will be passed to serializeUser by passport's Strategy framework

// Gets the user from the req object, all done by passport you can sit back and relax (req.session.passport.user)
passport.serializeUser((user, cb) => {
  console.log("Serializing User:", user)
  return cb(null, user);
});

// Attaches the user object to req.user because it's authenticating the user, should be able to call req.user for the returned obj now
passport.deserializeUser((req, user, done) => {

  Users.findOne({ where: { _id: user._id } })
    .then((user) => {
      // console.log('Deserialized User:', user.dataValues);
      return done(null, user.dataValues);
    })
    .catch((error) => {
      // console.error('Error deserializing user:', error);
      return done(error);
    });
});

