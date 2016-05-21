'use strict';

var util = require('util');
var bcrypt = require('bcryptjs');

var User = require('../../models/user');
var Helper = require('../helpers/helper');

var config = require('../../config');
var jwt = require('jsonwebtoken');

module.exports = {
  login: loginUser,
  logout: logoutUser
};

/*
  Functions in this controller used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function loginUser(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
  var username = req.swagger.params.username.value;
  var password = req.swagger.params.password.value;

  User.findOne({ username: username }, function(err, user) {
  		if (err) {
			Helper.handleError(err, res);

  		} else {
			var error = new Error("Username/password is incorrect.");
  			if (user) {
				if (bcrypt.compareSync(password, user.password)) {
					var token = jwt.sign({username:user.username}, config.web.jwt.secret, config.web.jwt.options);
					console.log("Login JWT: " + token);
		  			res.json({message: 'Login successful.', jwt: token});
				} else {
					Helper.handleError(error, res, 401);
				}

			} else {
				Helper.handleError(error, res, 401);
			}
		}
	});
}

function logoutUser(req, res) {
	var token = jwt.sign({username:req.user.username}, config.web.jwt.secret, {expiresIn: 0});
	console.log("Logout JWT: " + token);
	res.json({message: 'Logout successful.', jwt: token});
}

