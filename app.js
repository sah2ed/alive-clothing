'use strict';

var config = require('./config');
var https = require('https');
var fs = require('fs');
var app = require('express')();
var SwaggerExpress = require('swagger-express-mw');

//module.exports = app; // Added for testing


var options = {
	key: fs.readFileSync(config.web.options.key),
	cert: fs.readFileSync(config.web.options.cert)
};


var mongoose = require('mongoose');
var mongoURI = config.mongodb.uri;
mongoose.connect(mongoURI, function(err, res) {
	if (err) {
		console.log ('ERROR connecting to: ' + mongoURI + '. ' + err);
	} else {
		console.log ('Successfully connected to: ' + mongoURI);
	}
});


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});


SwaggerExpress.create(config, function(err, swaggerExpress) {
	if (err) { throw err; }

	// install middleware
	swaggerExpress.register(app);

	var port = config.web.port;
	// var server = https.createServer(options, app).listen(port);
	var server = app.listen(port); // uncomment to enable HTTP
	var io = require('socket.io').listen(server);

	config.web.io = io;

	console.log('Started the API on port: ' + port);
});
