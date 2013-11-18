module.exports = function setup(options, imports, register) {
  var express = require('express');
  var app = express();
  var passport = imports['passport-google'];
  var path = require('path');
  var sessions = require('client-sessions');

  app.configure(function() {
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express['static'](path.join(__dirname,'../../static')));

    app.use(sessions({
      cookieName: 'hpCook',
      secret: 'random sigilterminator str22init 1',
      duration: 24 * 60 * 60 * 1000,
      activeDuration: 1000 * 60 * 5
    }));

    app.use(passport.initialize());

    app.use(app.router);
  });

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

  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

  return app.listen(options.port, options.host, function() {
    console.log('%s: Node server started on %s:%d ...', Date(Date.now() ), options.host, options.port);
    return register(null, {
      'express': {
        app:app
      }
    });
  });

};
