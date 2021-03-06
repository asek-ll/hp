module.exports = function setup(options, imports, register) {
  var oauth2orize         = require('oauth2orize');
  var passport            = require('passport');
  var uid = require('uid2');
  var UserModel = imports.user.model;
  var RefreshTokenModel = imports.auth.RefreshTokenModel;
  var AccessTokenModel = imports.auth.AccessTokenModel;
  var config = imports.config;
  var app = imports.express.app;


  var server = oauth2orize.createServer();

  server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {
    UserModel.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.checkPassword(password)) { return done(null, false); }

      RefreshTokenModel.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
        if (err) {
          return done(err);
        }
      });
      AccessTokenModel.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
        if (err) {
          return done(err);
        }
      });

      var tokenValue = uid(32);
      var refreshTokenValue = uid(32);
      var token = new AccessTokenModel({ token: tokenValue, clientId: client.clientId, userId: user.userId });
      var refreshToken = new RefreshTokenModel({ token: refreshTokenValue, clientId: client.clientId, userId: user.userId });
      refreshToken.save(function (err) {
        if (err) { return done(err); }
      });
      var info = { scope: '*' };
      token.save(function (err, token) {
        if (err) {
          return done(err);
        }
        return done(null, tokenValue, refreshTokenValue, { 'expires_in': config.get('security:tokenLife') });
      });
    });
  }));

  server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {
    RefreshTokenModel.findOne({ token: refreshToken }, function(err, token) {
      if (err) { return done(err); }
      if (!token) { return done(null, false); }
      if (!token) { return done(null, false); }

      UserModel.findById(token.userId, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }

        RefreshTokenModel.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
          if (err){
            return done(err);
          }
        });
        AccessTokenModel.remove({ userId: user.userId, clientId: client.clientId }, function (err) {
          if (err) {
            return done(err);
          }
        });

        var tokenValue = uid(32);
        var refreshTokenValue = uid(32);
        var token = new AccessTokenModel({ token: tokenValue, clientId: client.clientId, userId: user.userId });
        var refreshToken = new RefreshTokenModel({ token: refreshTokenValue, clientId: client.clientId, userId: user.userId });
        refreshToken.save(function (err) {
          if (err) { return done(err); }
        });
        var info = { scope: '*' };
        token.save(function (err, token) {
          if (err) { return done(err); }
          done(null, tokenValue, refreshTokenValue, { 'expires_in': config.get('security:tokenLife') });
        });
      });
    });
  }));

  app.post('/oauth/token', [ 
           passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
           server.token(),
           server.errorHandler()
  ]);

  return register(null, {
    oauth2:{}
  });
};
