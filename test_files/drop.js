'use strict';

var config = require('../config');
var mongoose = require('mongoose');

mongoose.connect(config.mongodb.uri, function() {

    mongoose.connection.db.dropDatabase();
    console.log("Dropped the database.");
    mongoose.disconnect();
});