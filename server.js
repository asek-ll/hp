var path = require('path');
var architect = require("architect");

var configPath = path.join(__dirname, "plugins.js");
var config = architect.loadConfig(configPath);

architect.createApp(config, function (err, app) {
  if (err) {
    throw err;
  }

  var terminator = function(sig){
    if (typeof sig === "string") {
      app.services.logger.warn('%s: Received %s - terminating sample app ...',
                  Date(Date.now()), sig);
                  process.exit(1);
    }
    app.services.logger.warn('%s: Node server stopped.', Date(Date.now()) );
  };

  process.on('exit', function() { terminator(); });

  // Removed 'SIGPIPE' from the list - bugz 852598.
  ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
  ].forEach(function(element, index, array) {
    process.on(element, function() { terminator(element); });
  });


  app.services.express.app.all('/*', function(req, res) {
    res.sendfile('index.html', { root: './client/dist' });
  });
  app.services.express.run();
});
