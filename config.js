var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var ip = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
var host = process.env.OPENSHIFT_APP_DNS || "localhost:"+port;

var mongodb = {};

module.exports = [
  { packagePath: "./plugins/express",
    port: port,
    host: ip
  },
  { packagePath: "./plugins/passport-google",
    returnURL: 'http://' + host + '/auth/google/return',
    realm: 'http://' + host + '/'
  }
];
