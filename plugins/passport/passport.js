module.exports = function setup(options, imports, register) {
  var config = imports.config;
  var _ = require('lodash');
  var passport = require('passport');
  var BasicStrategy           = require('passport-http').BasicStrategy;
  var ClientPasswordStrategy  = require('passport-oauth2-client-password').Strategy;
  var BearerStrategy          = require('passport-http-bearer').Strategy;
  var LocalStrategy           = require('passport-local').Strategy;

  var UserModel               = imports.user.model;
  var ClientModel             = imports.auth.ClientModel;
  var AccessTokenModel        = imports.auth.AccessTokenModel;
  var RefreshTokenModel       = imports.auth.RefreshTokenModel;

  var crypto = require('crypto');
  var url = require('url');

  passport.use(new BasicStrategy(
    function(username, password, done) {
    ClientModel.findOne({ clientId: username }, function(err, client) {
      if (err) { return done(err); }
      if (!client) { return done(null, false); }
      if (client.clientSecret !== password) {
        return done(null, false);
      }
      return done(null, client);
    });
  }
  ));

  passport.use(new ClientPasswordStrategy(
    function(clientId, clientSecret, done) {
    ClientModel.findOne({ clientId: clientId }, function(err, client) {
      if (err) { return done(err); }
      if (!client) { return done(null, false); }
      if (client.clientSecret !== clientSecret) {
        return done(null, false);
      }

      return done(null, client);
    });
  }
  ));

  passport.use(new BearerStrategy(
    function(accessToken, done) {
    AccessTokenModel.findOne({ token: accessToken }, function(err, token) {
      if (err) { return done(err); }
      if (!token) { return done(null, false); }

      if( Math.round((Date.now()-token.created)/1000) > config.get('security:tokenLife') ) {
        AccessTokenModel.remove({ token: accessToken }, function (err) {
          if (err) {
            return done(err);
          }
        });
        return done(null, false, { message: 'Token expired' });
      }

      UserModel.findById(token.userId, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user' }); }

        var info = { scope: '*' };
        done(null, user, info);
      });
    });
  }
  ));

  passport.use(new LocalStrategy(
    function(username, password, done) {
    UserModel.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.checkPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
  ));


  imports.express.app.post('/login', passport.authenticate('local', { failureRedirect: '/login'}), function (req, res) {
    var user = req.user;
    var clientId = 'webclient';
    var redirect = function (err, params) {
      if(err){
        params = {error: err.toString()};
      }
      var pairs = _.map(params, function (value, key) {
        return key+'='+value;
      });
      var urlData = {
        pathname: '/oauth2callback',
        hash: '/'+pairs.join('&')
      };
      res.redirect(url.format(urlData));
    };

    RefreshTokenModel.remove({ userId: user.userId, clientId: clientId }, function (err) {
      if (err) {
        return redirect(err);
      }
    });
    AccessTokenModel.remove({ userId: user.userId, clientId: clientId }, function (err) {
      if (err) {
        return redirect(err);
      }
    });

    var tokenValue = crypto.randomBytes(32).toString('base64');
    var refreshTokenValue = crypto.randomBytes(32).toString('base64');
    var token = new AccessTokenModel({ token: tokenValue, clientId: clientId, userId: user.userId });
    var refreshToken = new RefreshTokenModel({ token: refreshTokenValue, clientId: clientId, userId: user.userId });
    refreshToken.save(function (err) {
      if (err) { return redirect(err); }
    });
    var info = { scope: '*' };
    token.save(function (err, token) {
      if (err) {
        return redirect(err);
      }
      return redirect(null, {
        accessToken: tokenValue, 
        refreshToken: refreshTokenValue, 
        'expires_in': config.get('security:tokenLife') 
      });
    });



  });



  passport.serializeUser(function(user, done) {
    done(null, user.userId);
  });

  passport.deserializeUser(function(id, done) {
    UserModel.findById(id, function (err, user) {
      done(err, user);
    });
  });


  imports.express.use(passport.initialize());
  

  register(null, {
    'passport': {
      passport: passport
    }
  });
};
