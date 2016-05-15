'use strict';

var config = require('../config');
var async = require("async");
var randomMac = require('random-mac');
var mongoose = require('mongoose');
var mongoURI = config.mongodb.uri;

mongoose.connect(mongoURI, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + mongoURI + '. ' + err);
    } else {
        console.log ('Successfully connected to: ' + mongoURI);
		async.waterfall([
			addProducts,
			addUsers,
			addDevices,
			addCustomers,
			addOrders
		], function (err, products, users, devices, customers, orders) {
			mongoose.disconnect(function() {console.log("Done.");});
		});
    }
});

var Order = require('../models/purchase').Order;
var OrderItem = require('../models/purchase').OrderItem;
var Product = require('../models/purchase').Product;
var User = require('../models/user');
var Device = require('../models/device');
var Customer = require('../models/customer');


function generateProducts() {
	var products = [];
	var price = 50;
	for (var i = 1; i <= config.testdata.products; i++) {
		products.push(
			new Product({
				name: "Product " + i,
				unitPrice: 100 + price,
				totalQuantity: 100,
				imagePath: "/i/product.png"
			})
		);
		price += i % 5 == 0 ? 50: 0;
	}
	return products;
}

function generateUsers() {
	var users = [];
	for (var i = 1; i <= config.testdata.users; i++) {
		users.push(
			new User({
				username: "user" + i,
				password: "user" + i,
				firstName: "Test",
				lastName: "User" + i,
				email: "user" + i + "@example.com"
			})
		);
	}
	return users;
}

function generateDevices(users) {
	var deviceTypes = ['AP120', 'AP130', 'AP230', 'AP250', 'AP370'];

	var devices = [];
	for (var i = 0; i < users.length; i++) {
		devices.push(
			new Device({
				name: users[i].firstName + " " + users[i].lastName + " Device",
				owner: {firstName: users[i].firstName, lastName: users[i].lastName},
				macAddress: randomMac('00:11:22'),
				deviceType: deviceTypes[i % deviceTypes.length],
    			isInStore: true
			})
		);
	}
	return devices;
}

function generateCustomers() {
	var customers = [];
	for (var i = 1; i <= config.testdata.customers; i++) {
		customers.push(
			new Customer({
				firstName: "Customer",
				lastName: "" + i,
				email: "customer" + i + "@example.com",
				phone: "+1(212)55555" + (50 + i),
				country: "USA",
				purchaseNote: "",
				isVIP: (i%5==0) ? true : false,
			})
		);
	}
	return customers;
}

function generateOrders(products, customers) {
	var orders = [];
	for (var i = 1; i <= config.testdata.customers; i++) {
		orders.push(
			new Order({

			})
		);
	}
	return orders;
}

function addProducts(callback) {
	console.log("Adding products.");

	var products = generateProducts();
	console.log(JSON.stringify(products));

	console.log("Added products.\n");
	callback(null, products);
}

function addUsers(products, callback) {
	console.log("Adding users.");

	var users = generateUsers();
	console.log(JSON.stringify(users));

	console.log("Added users.\n");
	callback(null, products, users);
}

function addDevices(products, users, callback) {
	console.log("Adding devices.");

	var devices = generateDevices(users);
	console.log(JSON.stringify(devices));

	console.log("Added devices.\n");
	callback(null, products, users, null);
}

function addCustomers(products, users, devices, callback) {
	console.log("Adding customers.");

	var customers = generateCustomers();
	console.log(JSON.stringify(customers));

	console.log("Added customers.\n");
	callback(null, products, users, devices, null);
}

function addOrders(products, users, devices, customers, callback) {
	console.log("Adding orders.");

	var orders = generateOrders(products, customers);
	console.log(JSON.stringify(orders));

	console.log("Added orders.\n");
	callback(null, products, users, devices, customers, null);
}