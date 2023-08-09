// seed the data with products
const { faker } = require('@faker-js/faker');
const { Product } = require('../models');

// create a 1000 products
for (i = 0; i < 1000; i++) {
    let newProduct = createProduct();
    console.log(i, newProduct);
}

function createProduct() {
    Product.create({
        name: faker.commerce.productName(),
        price: faker.commerce.price()
    })
    .then(product => {
        console.log(i, product);
        return product
    });
}