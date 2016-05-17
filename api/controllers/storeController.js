'use strict';

var util = require('util');
var Helper = require('../helpers/helper');
var Store = require('../../models/store');

module.exports = {
	getSurgeSettings: getSurgeSettings,
	updateSurgeSettings: updateSurgeSettings,
	collectPresence: collectPresence,
	publishPresence: publishPresence
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
	console.log("Receiving presence information.");
	console.log(req.headers);
	console.log(req.body);
}


function publishPresence(req, res) {

}