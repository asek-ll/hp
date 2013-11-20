module.exports = function setup(options, imports, register) {
  var express = imports.express, app = express.app;
  var sessions = require('client-sessions');
  var _ = require('lodash');
  
  var COOKIE_NAME = 'hpCook';

  var passport = require('passport'),
  GoogleStrategy = require('passport-google').Strategy;

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new GoogleStrategy({
    returnURL: options.returnURL,
    realm: options.realm
  },
  function(identifier, profile, done) {
    process.nextTick(function () {
      profile.roles = [];

      if(profile.emails && _.find(profile.emails,function (email) {
        return email.value === 'sopplet@gmail.com';
      })){

        profile.roles.push('admin');
      }

      //profile.identifier = identifier;
      return done(null, profile);
    });
  }));


  express.use(sessions({
    cookieName: COOKIE_NAME,
    secret: 'random sigilterminator str22init 1',
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5
  }));

  express.use(passport.initialize());

  app.get('/auth/google', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/');
  });

  app.get('/auth/google/return', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
    var u = req._passport.session.user;
    if(u){
      req[COOKIE_NAME].user = u;
    }
    res.redirect('/');
  });

  app.get('/logout', function (req, res) {
    req[COOKIE_NAME].reset();
    res.redirect('/');
  });

  app.get('/current-user', function (req, res) {
    var json = {
      user: req[COOKIE_NAME].user
    };
    res.json(200, json);
    res.end();
  });

  register(null, {
    'passport-google':passport
  });
};
