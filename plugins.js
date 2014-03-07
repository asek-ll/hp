var path = require('path');

module.exports = [
  { packagePath: "./plugins/config"},
  { packagePath: "./plugins/logger"},
  { packagePath: "./plugins/express", static: [
    {path: path.join(__dirname,'client/dist')}
    //{path: path.join(__dirname,'static')}
  ]},
  { packagePath: "./plugins/mongodb"},
  { packagePath: "./plugins/user"},
  { packagePath: "./plugins/auth"},
  { packagePath: "./plugins/passport"},
  { packagePath: "./plugins/oauth2"}
  //{ packagePath: "./plugins/passport-google", }
];
