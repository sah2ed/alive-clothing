'use strict';

var util = require('util');

module.exports = {
  add: add,
  get: get
};

function add(req, res) {
    var username = req.swagger.params.username.value;
    var password = req.swagger.params.password.value;
    var firstName = req.swagger.params.firstName.value;
    var lastName = req.swagger.params.lastName.value;

    var message = util.format('User (%s, %s, %s, %s)', username, password, firstName, lastName);
    console.log(message);
    res.json("User created successfully.");
}


function get(req, res) {
    var username = req.swagger.params.username.value;
    console.log("Username = " + username);
    res.json("User");
}