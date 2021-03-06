module.exports = function setup(options, imports, register) {
  var app = imports.express.app;
  var passport = require('passport');
  var mongoose = imports.mongodb.mongoose;
  var Schema = mongoose.Schema;
  var _ = require('lodash');

  var Account = new Schema({
    name: {
      type: String,
      unique: true,
      required: true
    },
    balance: {
      type: Number,
      default: 0
    },
    type: {
      type: Number,
      default: 0
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Account'
    },
    weight: {
      type: Number,
      default: 0
    },
    created: {
      type: Date,
      default: Date.now
    }
  });

  var AccountModel = mongoose.model('Account', Account);

  app.get('/api/accounts', passport.authenticate('bearer', { session: false }), function (req, res) {
    return AccountModel.find({}).sort({weight: 1}).exec(function (err, accounts) {
      res.send(accounts);
    });
  });
  app.post('/api/accounts', passport.authenticate('bearer', { session: false }), function (req, res) {
    var account = new AccountModel(req.body);
    return account.save(function (err) {
      res.send('done');
    });
  });
  app.get('/api/accounts/:id', passport.authenticate('bearer', { session: false }), function (req, res) {
    return AccountModel.findOne({_id: req.params.id}, function (err, account) {
      res.send(account || {});
    });
  });
  app.put('/api/accounts/:id', passport.authenticate('bearer', { session: false }), function (req, res) {
    var values = _.pick(req.body,'name','balance','type','parent','weight');
    return AccountModel.findOne({_id: req.params.id}, function (err, account) {
      if(err){
        return res.send();
      }
      _.each(values, function (value, key) {
        account.set(key,value);
      });
      return account.save(function (err) {
        return res.send(account);
      });
    });

    //return AccountModel.update({_id: req.params.id}, req.body,  function (err, account) {
      //console.log(account, err);
      //res.send(account || {});
    //});
  });
  app.delete('/api/accounts/:id', passport.authenticate('bearer', { session: false }), function (req, res) {
    return AccountModel.remove({_id: req.params.id},  function (err, account) {
      res.send(account || {});
    });
  });

  register(null, {
    accounting: {
    },
  });
};
