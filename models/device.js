var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DeviceSchema   = new Schema({
	name: { type: String, required: true, unique: false },
	owner: {
		firstName: { type: String },
    	lastName: { type: String }
	},

    macAddress: { type: String, required: true, unique: true },
    deviceType: { type: String, required: true }, /* enum: ['AP120', 'AP130', 'AP230', 'AP250', 'AP370'], default : 'AP120' */
    isInStore: { type: Boolean, required: false },

    createdAt: { type: Date, required: false, default: Date.now },
    updatedAt: { type: Date, required: false }
});

module.exports = mongoose.model('Device', DeviceSchema);