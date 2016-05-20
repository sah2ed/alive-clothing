'use strict';

var util = require('util');
var Helper = require('../helpers/helper');
var Store = require('../../models/store');
var config = require('../../config');

//var io = require('../../app');
var io = require('socket.io')();

module.exports = {
	getSurgeSettings: getSurgeSettings,
	updateSurgeSettings: updateSurgeSettings,
	collectPresence: collectPresence
};

function getSurgeSettings(req, res) {
    Store.find({}, function(err, settings) {
		if (err) {
			Helper.handleError(err, res);

		} else {
			console.log("All store settings: " + JSON.stringify(settings, null, 2));
			res.json(JSON.stringify(settings));
		}
	});
}

function updateSurgeSettings(req, res) {
    var customerAlertThreshold = req.swagger.params.customerAlertThreshold.value;
    var customerAlertWindow = req.swagger.params.customerAlertWindow.value;
	var customerAlertThresholdTotal = req.swagger.params.customerAlertThresholdTotal.value;

    var message = util.format('Store[settings=surge (%s, %s, %s)]',
    	customerAlertThreshold, customerAlertWindow, customerAlertThresholdTotal);
    console.log(message);

    var data = {
		customerAlertThreshold: customerAlertThreshold,
		customerAlertWindow: customerAlertWindow,
		customerAlertThresholdTotal: customerAlertThresholdTotal
	};

	Store.findOneAndUpdate({name: "surge"}, data, {upsert:true}, function(err, surge) {
		if (err) Helper.handleError(err, res);
		else res.json({message: 'Store surge settings saved successfully.'});
	});
}

function collectPresence(req, res) {
	console.log("Receiving presence information from HiveManager.");

	var token = req.get('Authorization');
	if (token) {
		token = token.slice(6, token.length);
		console.log('Request access token is valid: ' + token);
		if (config.aerohive.accessToken == token) {
			var data = JSON.stringify(req.body, null, 2);

			console.log(req.headers);
			res.json({message: 'OK'});

			console.log("Notifying websocket client with presence data.");
			console.log(data);
			config.web.io.sockets.emit('eventVip', data);

		} else {
			Helper.handleError('The access token is invalid.', res, 403);
		}
	} else {
		Helper.handleError('The access token is required.', res, 400);
	}

}