module.exports = function setup(options, imports, register) {
  var express = imports.express;
  var mongoose = imports.mongodb.mongoose;
  var Schema = mongoose.Schema;

  // Client
  var Client = new Schema({
    name: {
      type: String,
      unique: true,
      required: true
    },
    clientId: {
      type: String,
      unique: true,
      required: true
    },
    clientSecret: {
      type: String,
      required: true
    }
  });

  var ClientModel = mongoose.model('Client', Client);

  // AccessToken
  var AccessToken = new Schema({
    userId: {
      type: String,
      required: true
    },
    clientId: {
      type: String,
      required: true
    },
    token: {
      type: String,
      unique: true,
      required: true
    },
    created: {
      type: Date,
      default: Date.now
    }
  });

  var AccessTokenModel = mongoose.model('AccessToken', AccessToken);

  // RefreshToken
  var RefreshToken = new Schema({
    userId: {
      type: String,
      required: true
    },
    clientId: {
      type: String,
      required: true
    },
    token: {
      type: String,
      unique: true,
      required: true
    },
    created: {
      type: Date,
      default: Date.now
    }
  });

  var RefreshTokenModel = mongoose.model('RefreshToken', RefreshToken);

  return register(null, {
    'auth': {} 
  });
};
