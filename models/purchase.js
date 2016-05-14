var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var OrderSchema   = new Schema({
    orderNumber: { type: String, required: true, unique: true },
    amountPaid: { type: Number, required: true, min: 0 },
	items: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }],
    storeLocation: { type: String, required: false },
    createdAt: { type: Date, required: true, default: Date.now }
});

var OrderItemSchema   = new Schema({
    itemNumber: { type: String, required: true, unique: true },
    pricePaid: { type: Number, required: true, min: 0 },
    quantityBought: { type: Number, required: true, min: 0 },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    createdAt: { type: Date, required: false, default: Date.now }
});

var ProductSchema   = new Schema({
    name: { type: String, required: true, unique: true },
    unitPrice: { type: Number, required: true, min: 0 },
    totalQuantity: { type: Number, required: true, min: 0 },
    imagePath: { type: String, required: true },
    createdAt: { type: Date, required: false, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
module.exports = mongoose.model('OrderItem', OrderItemSchema);
module.exports = mongoose.model('Product', ProductSchema);