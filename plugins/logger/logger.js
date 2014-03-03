module.exports = function setup(options, imports, register) {
  var winston = require('winston');
  var logger = new winston.Logger({
    transports : [
      new winston.transports.Console({
      colorize:   true,
      level:      'debug',
    })
    ]
  });
  return register(null, {
    'logger': logger
  });

};
