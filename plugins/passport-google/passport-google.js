module.exports = function setup(options, imports, register) {
  var express = imports.express, app = express.app;
  var sessions = require('client-sessions');

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

      //profile.identifier = identifier;
      return done(null, profile);
    });
  }));


  express.use(sessions({
    cookieName: 'hpCook',
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
      req.hpCook.user = u;
    }
    res.redirect('/');
  });

  register(null, {
    'passport-google':passport
  });
};
