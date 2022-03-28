var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var User = require('../models/User');

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      let userData = {
        name: profile.displayName,
        username: profile.username,
      };

      User.findOne({ username: profile.username }, (err, user) => {
        if (err) return done(err);

        if (!user) {
          User.create(userData, (err, addedUser) => {
            if (err) return done(err);

            return done(null, addedUser);
          });
        }

        return done(null, user);
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, 'name username', (err, user) => {
    done(err, user);
  });
});
