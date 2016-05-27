'use strict';

var config = require('../config');
var async = require('async');
var _ = require('lodash');
var randomMac = require('random-mac');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var mongoURI = config.mongodb.uri;

mongoose.connect(mongoURI, config.mongodb.options, function(err, result) {
    if (err) {
        console.log('ERROR connecting to: ' + mongoURI + '. ' + err);
    } else {
        console.log('Successfully connected to: ' + mongoURI);
		async.waterfall([
			addProducts,
			addUsers,
			addDevices,
			addCustomers,
			addOrders
		], function (err, products, users, devices, customers, orders) {
			var orderItems = orders.reduce(function(items, order) { return items.concat(order.toObject().orderItems); }, []);

			async.series([
				function(callback) { Product.insertMany(products, async.apply(onInsertComplete, 'Product', callback)) },
				function(callback) { User.insertMany(users, async.apply(onInsertComplete, 'User', callback)) },
				function(callback) { Device.insertMany(devices, async.apply(onInsertComplete, 'Device', callback)) },
				function(callback) { Customer.insertMany(customers, async.apply(onInsertComplete, 'Customer', callback)) },
				function(callback) { OrderItem.insertMany(orderItems, async.apply(onInsertComplete, 'OrderItem', callback)) },
				function(callback) { Order.insertMany(orders, async.apply(onInsertComplete, 'Order', callback)) }
			], function (err) {
				mongoose.disconnect(function() {console.log("Done.");});
			});
		});
    }
});

var Order = require('../models/purchase').Order;
var OrderItem = require('../models/purchase').OrderItem;
var Product = require('../models/purchase').Product;
var User = require('../models/user');
var Device = require('../models/device');
var Customer = require('../models/customer');


/** 1. Generate test data collections. */
function generateProducts() {
	var products = [];
	var increment = 50;
	for (var i = 1; i <= config.testdata.products; i++) {
		products.push(
			new Product({
				name: "Product " + i,
				price: 100 + increment,
				totalQuantity: 100,
				imagePath: "/i/product.png"
			})
		);
		increment += i % 5 == 0 ? 50: 0;
	}
	return products;
}

function generateUsers() {
	var users = [];
	for (var i = 1; i <= config.testdata.users; i++) {
		users.push(
			new User({
				username: "user" + i,
				password: bcrypt.hashSync("user" + i, bcrypt.genSaltSync(10)),
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
				isVIP: (i%5==0) ? true : false,
				purchaseNote: ""
			})
		);
	}
	return customers;
}

function generateRandomProducts(products) {
	var randomProducts = [];
	var productCount = _.random(1, 3);
	for (var i = 0; i < productCount; i++) {
		var productIndex = _.random(0, products.length - 1);
		randomProducts.push(products[productIndex]);
	}
	return randomProducts;
}

function generatedOrderItems(products) {
	var orderItems = [];
	var randomProducts = generateRandomProducts(products);
	for (var i = 0; i < randomProducts.length; i++) {
		config.id.itemNumber = config.id.itemNumber + 1;
		orderItems.push(
			new OrderItem({
				itemNumber: config.id.itemNumber,
				pricePaid: randomProducts[i].price,
				quantityBought: _.random(1, 6),
				product: randomProducts[i]._id
			})
		);
	}
	return orderItems;
}

function generateOrders(products, customers) {
	var orders = [];

	// Temporary schema update to defer the persistence of OrderItems.
	var OrderSchema = Order.schema;
	OrderSchema.set('toJSON', { virtuals: true });
	OrderSchema.set('toObject', { virtuals: true });
	OrderSchema.virtual('orderItems').set(function(orderItems) {
		this._orderItems = orderItems;
	});
	OrderSchema.virtual('orderItems').get(function() {
  		return this._orderItems;
	});

	var orderNumber = Number((new Date()).toISOString().replace(/[^0-9]/g, "").slice(0, 13));
	for (var i = 0; i < customers.length; i++) {
		var orderItems = generatedOrderItems(products);
		var orderItemIds = orderItems.map(function(orderItem, index) { return orderItem._id; });
		var amountPaid = orderItems.reduce(function(sum, item) {return sum + item.pricePaid * item.quantityBought;}, 0);
		orders.push(
			new Order({
				customer: customers[i]._id,
				orderNumber: orderNumber + i + 1,
				amountPaid: amountPaid,
				items: orderItemIds,
				storeLocation: "California",
				orderItems: orderItems
			})
		);
	}
	return orders;
}


/** 2. Batch insert the collections into the MongoDB database. */
function addProducts(callback) {
	console.log("Adding products.");

	var products = generateProducts();
	console.log(JSON.stringify(products, null, 2));

	console.log("Added products.\n");
	callback(null, products);
}

function addUsers(products, callback) {
	console.log("Adding users.");

	var users = generateUsers();
	console.log(JSON.stringify(users, null, 2));

	console.log("Added users.\n");
	callback(null, products, users);
}

function addDevices(products, users, callback) {
	console.log("Adding devices.");

	var devices = generateDevices(users);
	console.log(JSON.stringify(devices, null, 2));

	console.log("Added devices.\n");
	callback(null, products, users, devices);
}

function addCustomers(products, users, devices, callback) {
	console.log("Adding customers.");

	var customers = generateCustomers();
	console.log(JSON.stringify(customers, null, 2));

	console.log("Added customers.\n");
	callback(null, products, users, devices, customers);
}

function addOrders(products, users, devices, customers, callback) {
	console.log("Adding orders.");

	var orders = generateOrders(products, customers);
	console.log(JSON.stringify(orders, null, 2));

	console.log("Added orders.\n");
	callback(null, products, users, devices, customers, orders);
}

function onInsertComplete(model, callback, err, documents) {
	if (err) {
		console.log("Bulk insertion failed for " + model + " documents.");
		console.error(err);
		callback(err);
	} else {
		console.info('%d %s documents were inserted successfully. ', documents.length, model);
		callback(null);
    }
}