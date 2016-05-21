'use strict';

var util = require('util');
var Helper = require('../helpers/helper');
var Device = require('../../models/device');

module.exports = {
  addDevice: addDevice,
  getDeviceById: getDeviceById,
  getDevices: getDevices
};

function addDevice(req, res) {
    var firstName = req.body.ownerFirstName;
    var lastName = req.body.ownerLastName;
	var deviceName = req.body.deviceName;
    var deviceType = req.body.deviceType;
    var macAddress = req.body.macAddress;

    var message = util.format('Device (%s, %s, %s, %s, %s)', firstName, lastName, deviceName, deviceType, macAddress);
    console.log(message);

    var newDevice = new Device({
		owner : {
			firstName: firstName,
			lastName: lastName
		},
		name: deviceName,
		deviceType: deviceType,
		macAddress: macAddress
	});

	Device.findOne({$or: [{macAddress:macAddress}]}, function(err, device) {
		if (err) Helper.handleError(err, res);
		else {
			if (device) {
				var error = new Error("The device info provided has been previously registered.");
				Helper.handleError(error, res, 409);

			} else {
				newDevice.save(function(error) {
					if (error) Helper.handleError(error, res);
					else {
						console.log('Device saved successfully.');
						res.json({message: newDevice._id});
					}
				});
			}
		}
	});
}

function getDeviceById(req, res) {
	var id = req.swagger.params.id.value;
	Device.findById(id, function(err, device) {
			if (err) {
				Helper.handleError(err, res, 400);

			} else {
				if (device) res.json(JSON.stringify(device));
				else Helper.handleError(err, res, 404);
			}
	});
}

function getDevices(req, res) {
    Device.find({}, function(err, devices) {
		if (err) {
			Helper.handleError(err, res);

		} else {
			console.log("All devices: " + JSON.stringify(devices, null, 2));
			res.json(JSON.stringify(devices));
		}
	});
}