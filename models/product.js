const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    price: Number,
    name: String
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;