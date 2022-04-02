const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GithubStrategy = require('passport-github').Strategy;
const User = require('../models/user');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      let userData = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
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
    if (!email || !password) {
      return done(null, false, {
        message: 'Email or password is not entered.',
      });
    }

    User.findOne({ email }, (err, user) => {
      if (err) return done(err);

      if (!user) {
        return done(null, false, { message: 'User is not registered.' });
      }

      user.verifyPassword(password, (err, result) => {
        if (err) return done(err);

        if (!result) {
          return done(null, false, { message: 'Password is incorrect.' });
        }

        return done(null, user);
      });
    });
  })
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      let name = profile.displayName;
      let userData = {
        firstName: name.split(' ')[0],
        lastName: name.split(' ').splice(-1).join(' '),
        email: profile.emails[0].value,
        fullName: name,
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

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, 'fullName email', (err, user) => {
    done(err, user);
  });
});
