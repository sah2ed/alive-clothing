'use strict';

var util = require('util');
var passwordHash = require('password-hash');
var User = require('../../models/user');

module.exports = {
  addUser: addUser,
  findByUsername: findByUsername
};


function addUser(req, res) {
	var username = req.body.username;
  	var password = passwordHash.generate(req.body.password);
  	var firstName = req.body.firstName;
  	var lastName = req.body.lastName;
  	var email = req.body.email;

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
				res.status(409).json({message: "This username is not available."});

			} else {
				newUser.save(function(err) {
					if (err) {
						console.log(err);
						res.status(500).json({message: err});

					} else {
						console.log('User saved successfully.');
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