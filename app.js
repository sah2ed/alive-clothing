'use strict';

var config = require('./config');
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // Added for testing

var mongoose = require('mongoose');
var mongoURI = config.mongodb.uri;
mongoose.connect(mongoURI, function (err, res) {
	if (err) {
		console.log ('ERROR connecting to: ' + mongoURI + '. ' + err);
	} else {
		console.log ('Successfully connected to: ' + mongoURI);
	}
});


SwaggerExpress.create(config, function(err, swaggerExpress) {
	if (err) { throw err; }

	// install middleware
	swaggerExpress.register(app);

	var port = config.web.port;
	app.listen(port);

	console.log('Started the API on port: ' + port);
});
