'use strict';

var util = require('util');

module.exports = {
  add: add,
  findByUsername: findByUsername
};

var User = require('../../models/user');

function add(req, res) {
	var username = req.swagger.params.username.value;
  	var password = req.swagger.params.password.value;
  	var firstName = req.swagger.params.firstName.value;
  	var lastName = req.swagger.params.lastName.value;
  	var email = req.swagger.params.email.value;

  	var message = util.format('User (%s, %s, %s, %s, %s)', username, password, firstName, lastName, email);
	console.log(message);

	var newUser = new User({
		username: username,
		password: password,
		firstName: firstName,
		lastName: lastName,
		email: email
	});

	User.findOne({ username: username }, function(err, user) {
		if (err) {
			console.log(err);
			res.status(500).json({message: err});

		} else {
			if (user) {
				console.log("Username exists: " + JSON.stringify(user));
				res.status(400).json({message: "This username is not available."});

			} else {
				newUser.save(function(err) {
					if (err) {
						console.log(err);
						res.status(500).json({message: err});

					} else {
						console.log('User saved successfully!');
						res.json({message: newUser._id});
					}
				});
			}
		}
	});
}


function findByUsername(req, res) {
	var username = req.swagger.params.username.value;

	User.findOne({ username: username }, function(err, user) {
			if (err) {
				console.log(err);
				res.status(400).json({message: err});

			} else {
				if (user) {
					console.log("Username exists: " + JSON.stringify(user));
					res.json(JSON.stringify(user));
				} else {
					var message = "Username does not exist: " + username;
					console.log(message);
					res.status(404).json({message: message});
				}
			}
	});
}