var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StoreSchema   = new Schema({
    name: { type: String, required: true, unique: true, default: "surge" },

	customerAlertThreshold: { type: Number, required: true },
	customerAlertWindow: { type: Number, required: true },
	customerAlertThresholdTotal: { type: Number, required: true },

    createdAt: { type: Date, required: false, default: Date.now },
    updatedAt: { type: Date, required: false }
});

module.exports = mongoose.model('Store', StoreSchema);