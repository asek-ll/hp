module.exports = function setup(options, imports, register) {
  var nconf = require('nconf');

  nconf.file(options.file || "./settings/default.json");

  return register(null, {
    config: nconf
  });
};
