var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// Github login controls

router.get('/auth/github', passport.authenticate('github'));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/failure' }),
  (req, res) => {
    res.redirect('/success');
  }
);

router.get('/success', (req, res) => {
  let name = req.user.name;
  res.render('success', { name });
});

router.get('/failure', (req, res) => {
  res.render('failure');
});

module.exports = router;
