#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var nconf   = require('nconf');

var passport = require('passport')
  , util = require('util')
  , GoogleStrategy = require('passport-google').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:3005/auth/google/return',
    realm: 'http://localhost:3005/'
  },
  function(identifier, profile, done) {
    process.nextTick(function () {

      console.log(identifier, profile);
      
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

nconf.env().file({file: 'configs/settings.json'});
nconf.defaults({
  OPENSHIFT_NODEJS_IP: '127.0.0.1',
  OPENSHIFT_NODEJS_PORT: '3005'
});

/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = nconf.get('OPENSHIFT_NODEJS_IP');
        self.port      = nconf.get('OPENSHIFT_NODEJS_PORT');
    };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };




    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
      var app = self.app = express();

      app.configure(function() {
        app.use(express.cookieParser());
        app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(express['static'](__dirname+'/static'));
        app.use(express.session({ secret: 'random sigilterminator str22init 1' }));
        // Initialize Passport!  Also use passport.session() middleware, to support
        // persistent login sessions (recommended).
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(app.router);
      });


      app.get('/auth/google', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
        res.redirect('/');
      });
      app.get('/test', function(req, res) {
          console.log('custom middleware', req.session);
          console.log('USER:',req.user);
        res.redirect('/');
      });

      app.get('/auth/google/return', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
        res.redirect('/');
      });

    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.setupTerminationHandlers();
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

