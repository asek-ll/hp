module.exports = function setup(options, imports, register) {
  var express = require('express');
  var app = express();
  var passport = imports['passport-google'];
  var path = require('path');

  app.configure(function() {
    app.use(express.cookieParser());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express['static'](path.join(__dirname,'../../static')));
    app.use(express.session({ secret: 'random sigilterminator str22init 1' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
  });

  app.get('/auth/google', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/');
  });
  app.get('/test', function(req, res) {
    console.log('custom middleware', req.session);
    console.log('USER:',req.user);
    res.redirect('/');
  });

  app.get('/auth/google/return', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
    res.redirect('/');
  });

  return app.listen(options.port, options.host, function() {
    console.log('%s: Node server started on %s:%d ...', Date(Date.now() ), options.host, options.port);
    return register(null, {
      'express': {
        app:app
      }
    });
  });

};
