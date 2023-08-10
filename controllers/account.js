// Imports
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { JWT_SECRET } = process.env;

// Import the User model
const User = require("../models");

// Profile Fetch
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log('====> inside /profile');
    console.log(req.body);
    console.log('====> user')
    console.log(req.user);

    // Extract only the necessary fields
    const { 
      id, firstName, lastName, email, birthday, phone, public, buzzList, public_buzzList_users 
    } = req.user;
  
    // Send the extracted data
    res.json({ 
      id, firstName, lastName, email, birthday, phone, public, buzzList, public_buzzList_users 
    });
});



router.put('/:id', (req, res) => {
    const updateQuery = {}
    // check firstName
    if (req.body.firstName) {
        updateQuery.firstName = req.body.firstName
    }
    // check lastName
    if (req.body.lastName) {
        updateQuery.lastName = req.body.lastName
    }
    // check birthday
    if (req.body.birthday) {
        updateQuery.birthday = req.body.birthday
    }
    // check email
    if (req.body.email) {
        updateQuery.email = req.body.email
    }
    // check phone
    if (req.body.phone) {
        updateQuery.phone = req.body.phone
    }

    User.findByIdAndUpdate(req.params.id, {$set: updateQuery }, {new: true})
    .then((user) => {
        return res.json({ message: `${user.email} was updated`, user: user});
    })
    .catch((error) => {
        console.log('error inside PUT /account/:id', error);
        return res.json({ message: 'error occured, please try again.' });
    });
});


module.exports = router;
