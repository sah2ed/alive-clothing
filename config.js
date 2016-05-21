var config = {};

config.appRoot = __dirname // required for swagger

config.mongodb = {};
config.web = {};
config.aerohive = {};
config.testdata = {};
config.id = {};

config.mongodb.uri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/AliveClothing';
config.mongodb.options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};

config.web.port = process.env.PORT || 3000;
config.web.options = {
  key: 'test_files/cert/server.key',
  cert: 'test_files/cert/server.crt'
};
config.web.jwt = {};
config.web.jwt.secret = 'aliv3Cl0th1ng';
config.web.jwt.options = {expiresIn: '7d'};

config.aerohive.accessToken = 'VpVw29xZVGWqVhNHgEcpYUitt05HSsixd7f09801';
// Workaround for HiveManager as it only supports 32 char tokens
config.aerohive.accessToken = 'VpVw29xZVGWqVhNHgEcpYUitt05HSsix';


config.testdata.users = 5;
config.testdata.products = 20;
config.testdata.customers = 5;
config.id.itemNumber = 400000;

module.exports = config;

