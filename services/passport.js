const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//Create Local Strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
  //verify email and password, call done() with the user if email and pass are correct

  //otherwise call done() with false
  User.findOne({ email: email }, function (err, user) {
    if (err) return done(err);
    if (!user) return done(null, false);

    //if user was found
    user.comparePassword(password, function (err, isMatch) {
      if (err) return done(err);
      if (!isMatch) return done(null, false);
      return done(null, user);
    });

  });

});

//Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

//Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  //See if the user.id in the payload exist in the db
  //If it does call 'done()'
  User.findById(payload.sub, function (err, user) {
    if (err) return done(err, false);

    if (user) return done(null, user);
    else return done(null, false);
  })
});

//Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
