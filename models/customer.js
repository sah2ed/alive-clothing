var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CustomerSchema   = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    isVIP: { type: Boolean, required: true },

	purchaseNote: { type: String, required: false },
    isInStore: { type: Boolean, required: false },

    createdAt: { type: Date, required: false, default: Date.now },
    updatedAt: { type: Date, required: false }
});

module.exports = mongoose.model('Customer', CustomerSchema);