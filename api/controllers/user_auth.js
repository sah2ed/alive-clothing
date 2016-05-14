'use strict';

var util = require('util');
var uuid = require('node-uuid');

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

  var message = "Username/password is incorrect.";
  if (username && password) {
	  if (username === 'user1' && password === 'test') {
		  message = "Login successful.";
		  var accessToken = uuid.v1();
		  res.json({message: message, accessToken: accessToken});
		  return;
	  }
  }

  res.status(401).json({message: message});
}

function logoutUser(req, res) {
	var message = "Missing access token.";
	console.log(JSON.stringify(req.query));
	if (!req.query.accessToken) return res.status(401).json({message: message});

	// res.json({message: "Logout successful."});
	res.redirect('/');
}

