const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const AccountSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    userBirthdayCountdown: {
        type: Number,  // Assuming the countdown is stored as a number
    },
    publicBuzzlist: [{
        name: {
            type: String,
            required: true,
            trim: true,
        },
        birthDate: {
            type: Date,
            required: true,
        },
        countdown: {  // If you'd like a countdown for each birthday in the Buzzlist
            type: Number,
        }
    }]
});

// Export the model
module.exports = Account = mongoose.model('Account', AccountSchema);
