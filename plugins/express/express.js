module.exports = function setup(options, imports, register) {
  var express = require('express');
  var app = express();
  var middlewares = express();

  var path = require('path');
  var port = imports.config.get('port') || 3000;
  var ip = imports.config.get('ip') || "0.0.0.0";

  app.use(middlewares);
  app.use(app.router);
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

  middlewares.use(express.urlencoded());
  middlewares.use(express.methodOverride());
  middlewares.use(express['static'](path.join(__dirname,'../../client/dist')));

  var run = function (next) {
    return app.listen(port, ip, function() {
      imports.logger.info('%s: Node server started on %s:%d ...', Date(Date.now() ), ip, port);
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
