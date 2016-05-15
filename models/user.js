var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	firstName: { type: String },
	lastName: { type: String },
	email: { type: String, required: true, unique: false },

	isInStore: { type: Boolean, required: false },
	location: { type: String, required: false },

	createdAt: { type: Date, required: false, default: Date.now },
  	updatedAt: { type: Date, required: false }
});

module.exports = mongoose.model('User', UserSchema);