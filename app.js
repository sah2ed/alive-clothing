'use strict';

var config = require('./config');
var https = require('https');
var fs = require('fs');
var app = require('express')();
var SwaggerExpress = require('swagger-express-mw');
var jwt = require('jsonwebtoken');

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

config.swaggerSecurityHandlers = {
    api_key: function (req, authOrSecDef, scopesOrApiKey, callback) {
		// console.log("Authorization: " + scopesOrApiKey);
		try {
			var user = jwt.verify(scopesOrApiKey, config.web.jwt.secret);
			req.user = user;
			console.log("Request made by: " + JSON.stringify(req.user));
			callback(null);

		} catch(err) {
			callback(err);
		}
    }
};


SwaggerExpress.create(config, function(err, swaggerExpress) {
	if (err) { throw err; }

	// install middleware
	swaggerExpress.register(app);

	var port = config.web.port;
	//var server = https.createServer(options, app).listen(port);
	 var server = app.listen(port); // uncomment to enable HTTP
	var io = require('socket.io').listen(server);

	config.web.io = io;
	io.on('connection', function(socket){
		io.emit('eventStart', 'Connected to the web socket on port: ' + port);
    });

	console.log('Started the REST API on port: ' + port);
});
