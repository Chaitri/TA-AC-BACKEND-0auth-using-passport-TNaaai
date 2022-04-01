const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
  res.render('userRegistration');
});

router.post('/register', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return next(err);
    console.log(req.body);

    if (user) {
      return res.redirect('/users/login');
    }

    if (req.body.password.length < 5 || req.body.password.length > 20) {
      return res.redirect('/users/register');
    }

    User.create(req.body, (err, user) => {
      if (err) return next(err);
      res.redirect('/users/login');
    });
  });
});

router.get('/login', (req, res) => {
  res.render('userLoginForm');
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/failure',
    failureMessage: true,
  }),
  (req, res, next) => {
    res.redirect('/success');
  }
);

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
});

module.exports = router;
