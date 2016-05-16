'use strict';

var util = require('util');
var Helper = require('../helpers/helper');
var Customer = require('../../models/customer');

module.exports = {
  addCustomer: addCustomer,
  getCustomerById: getCustomerById,
  getCustomers: getCustomers
};

function addCustomer(req, res) {
    var firstName = req.swagger.params.firstName.value;
    var lastName = req.swagger.params.lastName.value;
    var email = req.swagger.params.email.value;
	var phone = req.swagger.params.phone.value;
    var country = req.swagger.params.country.value;
    var isVIP = req.swagger.params.isVIP.value;

    var message = util.format('Customer (%s, %s, %s, %s, %s, %s)', firstName, lastName, email, phone, country, isVIP);
    console.log(message);

    var newCustomer = new Customer({
		firstName: firstName,
		lastName: lastName,
		email: email,
		phone: phone,
		country: country,
		isVIP: isVIP
	});

	Customer.findOne({$or: [{email:email}, {phone:phone}]}, function(err, customer) {
		if (err) Helper.handleError(err, res);
		else {
			if (customer) {
				var error = new Error("The contact info provided has been previously registered.");
				Helper.handleError(error, res, 409);

			} else {
				newCustomer.save(function(error) {
					if (error) Helper.handleError(error, res);
					else {
						console.log('Customer saved successfully.');
						res.json({message: newCustomer._id});
					}
				});
			}
		}
	});
}

function getCustomerById(req, res) {
	var id = req.swagger.params.id.value;
	// id = id.replace(/"/g, '');
	Customer.findById(id, function(err, customer) {
			if (err) {
				Helper.handleError(err, res, 400);

			} else {
				if (customer) res.json(JSON.stringify(customer));
				else Helper.handleError(err, res, 404);
			}
	});
}

function getCustomers(req, res) {
    Customer.find({}, function(err, customers) {
		if (err) {
			Helper.handleError(err, res);

		} else {
			// console.log("All customers: " + JSON.stringify(customers, null, 2));
			res.json(JSON.stringify(customers));
		}
	});
}