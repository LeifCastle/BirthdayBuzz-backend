const mongoose = require('mongoose');

// create the user schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    jobTitle: String,
    birthdate: Date,
    password: { type: String, required: true },
    address: {
        streetAddress: String,
        city: String,
        state: String,
        zipCode: Number
    },
    number: String
}, { timestamps: true });

// create model
const User = mongoose.model('User', userSchema);

// export the model to be used
module.exports = User;