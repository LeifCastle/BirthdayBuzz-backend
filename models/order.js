const mongoose = require('mongoose');

// order schema
const orderSchema = new mongoose.Schema({
    buyer: String,
    trackingNumber: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

// create the model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;