module.exports = function setup(options, imports, register) {
  var mongoose = require('mongoose');
  var log  = imports.logger;

  mongoose.connect(imports.config.get('mongodb:uri'),function (err) {
    if(err){
      log.error('connection error:', err.message);
      return register(err);
    }
    log.info("Connected to DB!");
    return register(null, {
      'mongodb': {
        mongoose: mongoose
      } 
    });
  });

};
