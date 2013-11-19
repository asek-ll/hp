module.exports = function setup(options, imports, register) {
  var express = require('express');
  var app = express();
  var middlewares = express();

  var path = require('path');

  app.use(middlewares);
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

  middlewares.use(express.urlencoded());
  middlewares.use(express.methodOverride());
  middlewares.use(express['static'](path.join(__dirname,'../../static')));

  var run = function (next) {
    return app.listen(options.port, options.host, function() {
      console.log('%s: Node server started on %s:%d ...', Date(Date.now() ), options.host, options.port);
      if(typeof next === 'function'){
        return next();
      }
    });
  };

  var use = function () {
    middlewares.use.apply(middlewares, arguments);
  };

  return register(null, {
    'express': {
      app: app,
      run: run,
      use: use
    }
  });



};
