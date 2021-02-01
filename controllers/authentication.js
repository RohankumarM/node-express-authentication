const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user){
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next){
  //User has already had their email and password, just give the token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    return res.status(422).send({ error: 'You must provide an email and password'})
  }
  //see if the user with the email exists
  User.findOne({ email: email }, (err, existingUser) => {
    if (err) return next(err);
    //If a user exists, return an duplicating error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use.' })
    }

    //If a user does not exisit, create a new user and save it
    const user = new User({
      email, 
      password
    });
    user.save((err) => {
      if(err) return next(err);
    });

    //Respond with success when user is created
    res.status(200).json({ token: tokenForUser(user) });

  });
}