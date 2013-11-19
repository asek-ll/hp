var path = require('path');
var architect = require("architect");

var configPath = path.join(__dirname, "config.js");
var config = architect.loadConfig(configPath);

architect.createApp(config, function (err, app) {
  if (err) {
    throw err;
  }

  var terminator = function(sig){
    if (typeof sig === "string") {
      console.log('%s: Received %s - terminating sample app ...',
                  Date(Date.now()), sig);
                  process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()) );
  };

  process.on('exit', function() { terminator(); });

  // Removed 'SIGPIPE' from the list - bugz 852598.
  ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
  ].forEach(function(element, index, array) {
    process.on(element, function() { terminator(element); });
  });

  //console.log(app.ser);
  app.services.express.run();
});
