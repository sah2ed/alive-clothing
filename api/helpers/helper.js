'use strict';

module.exports = {
	handleError: handleError
};

function handleError(error, res, code) {
	code = code || 500;
	console.log(error);
	var message = error.message || error.errmsg || error.toString() || "Error occurred.";
	res.status(code).json({message: message});
}