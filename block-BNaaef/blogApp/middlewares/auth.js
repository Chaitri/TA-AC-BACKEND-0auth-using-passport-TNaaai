const User = require('../models/user');

module.exports = {
  isUserLoggedIn: (req, res, next) => {
    if (req.session && req.session.passport.user) {
      next();
    } else {
      req.flash('error', 'Please login to view content');
      res.redirect('/users/login');
    }
  },

  userInfo: (req, res, next) => {
    let userId;
    if (req.session.passport) {
      userId = req.session.passport.user;
    }
    if (userId) {
      User.findById(userId, 'email fullName', (err, user) => {
        if (err) return next(err);
        req.user = user;
        res.locals.user = user;
        next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
};
