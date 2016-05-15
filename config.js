var config = {};

config.appRoot = __dirname // required for swagger

config.mongodb = {};
config.web = {};
config.aerohive = {};
config.testdata = {};

config.mongodb.uri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/AliveClothing'
config.web.port = process.env.PORT || 10010;
config.testdata.users = 5;
config.testdata.products = 30;
config.testdata.customers = 10;

module.exports = config;