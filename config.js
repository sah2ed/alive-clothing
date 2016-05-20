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

config.aerohive.accessToken = 'VpVw29xZVGWqVhNHgEcpYUitt05HSsixd7f09801';


config.testdata.users = 5;
config.testdata.products = 20;
config.testdata.customers = 5;
config.id.itemNumber = 400000;

module.exports = config;

