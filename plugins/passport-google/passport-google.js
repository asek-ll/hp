module.exports = function setup(options, imports, register) {
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

      console.log(identifier, profile);

      profile.identifier = identifier;
      return done(null, profile);
    });
  }));

  register(null, {
    'passport-google':passport
  });
};
