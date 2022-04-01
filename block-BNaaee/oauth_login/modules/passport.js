const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      let userData = {
        name: profile.displayName,
        username: profile.username,
        email: profile._json.email,
      };

      User.findOne({ email: profile._json.email }, (err, user) => {
        if (err) return done(err);

        if (!user) {
          User.create(userData, (err, insertedUser) => {
            if (err) return done(err);

            return done(null, insertedUser);
          });
        }

        return done(null, user);
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      let userData = {
        name: profile.displayName,
        email: profile.emails[0].value,
      };

      User.findOne({ email: profile.emails[0].value }, (err, user) => {
        if (err) return done(err);

        if (!user) {
          User.create(userData, (err, insertedUser) => {
            if (err) return done(err);

            return done(null, insertedUser);
          });
        }

        return done(null, user);
      });
    }
  )
);

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        let message = 'No such User!';
        return done(null, false, { message: message });
      }

      user.verifyPassword(password, (err, result) => {
        if (err) return done(err);
        if (!result) {
          let message = 'Incorrest Pwd';
          return done(null, false, { message: message });
        }
        return done(null, user);
      });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, 'name email', (err, user) => {
    done(err, user);
  });
});
