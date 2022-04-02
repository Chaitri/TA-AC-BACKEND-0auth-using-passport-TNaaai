var express = require('express');
var router = express.Router();
const User = require('../models/user');
const auth = require('../middlewares/auth');
const passport = require('passport');

// register router

router.get('/register', (req, res) => {
  let error = req.flash('error')[0];
  res.render('registerForm', { error });
});

router.post('/register', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return next(err);

    // user exists
    if (user) {
      req.flash('error', 'Email already exists.');
      return res.redirect('/users/register');
    }

    // password is less than 4 chars
    if (req.body.password.length < 5 || req.body.password.length > 20) {
      req.flash('error', 'Password must be between 5 and 20 characters.');
      return res.redirect('/users/register');
    }

    // user does not exist
    User.create(req.body, (err, user) => {
      if (err) return next(err);
      res.redirect('/users/login');
    });
  });
});

// login router
router.get('/login', (req, res) => {
  let error = req.flash('error')[0];
  res.render('loginForm', { error });
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: true,
  }),
  (req, res, next) => {
    res.redirect('/users/dashboard');
  }
);

router.use(auth.isUserLoggedIn);

// dashboard router
router.get('/dashboard', (req, res, next) => {
  res.render('dashboard');
});

// logout router
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});

module.exports = router;
