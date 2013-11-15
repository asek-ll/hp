var port = process.env.OPENSHIFT_NODEJS_PORT || 3005;
var ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var host = process.env.OPENSHIFT_APP_DNS || "localhost:"+port;

var mongodb = {
  "user": "admin",
  "password": "ezwElyNDri-T",
  "database": "hp"
};

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
