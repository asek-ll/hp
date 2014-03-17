module.exports = function setup(options, imports, register) {
  var app = imports.express.app;
  var passport = require('passport');
  var mongoose = imports.mongodb.mongoose;
  var Schema = mongoose.Schema;

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
    return AccountModel.find({}, function (err, accounts) {
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
    var account = req.body;
    delete account._id;
    return AccountModel.update({_id: req.params.id}, req.body,  function (err, account) {
      res.send(account || {});
    });
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
