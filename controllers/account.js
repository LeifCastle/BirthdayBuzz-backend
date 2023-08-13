// Imports
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { JWT_SECRET } = process.env;

// Import the User model
const { User } = require("../models");

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

router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id)
    .then((user) => {
        return res.json({ message: `${user.email} was deleted`});
    })
    .catch((error) => {
        console.log('error inside DELETE /account/:id', error);
        return res.json({ message: 'error occured, please try again.' });
    });
});

router.get('/searchUsers', async (req, res) => {
    const searchQuery = req.query.query;
    console.log('searchQuery', searchQuery)
  
    if (!searchQuery) {
      return res.status(400).json({ error: 'Query parameter is required.' });
    }
  
    try {
      const users = await User.find({ 
        firstName: new RegExp(searchQuery, 'i') 
      });
  
      res.json(users);
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  exports.addToBuzzlist = async (req, res) => {
    const { userIdToAdd, relation, reminderTimeFrame, delivery_system, message, public } = req.body;

    // Check if all required details are present
    if (!userIdToAdd) {
        return res.status(400).json({ success: false, message: "Invalid user data provided." });
    }

    try {
        // Fetch the user whose BuzzList will be updated
        const user = await User.findById(req.user._id); // Assuming req.user._id contains the logged-in user's ID, which should be set by your authentication middleware

        if (!user) {
            return res.status(404).json({ success: false, message: "Logged-in user not found." });
        }

        // Fetch the user data that will be added to the BuzzList
        const userToAdd = await User.findById(userIdToAdd);

        if (!userToAdd) {
            return res.status(404).json({ success: false, message: "User to add not found." });
        }

        // Create the BuzzList entry
        const buzzListEntry = {
            name: `${userToAdd.firstName} ${userToAdd.lastName}`,
            birthday: userToAdd.birthday,
            relation,
            reminderTimeFrame,
            delivery_system,
            message,
            public
        };

        // Add to the user's BuzzList
        user.buzzList.push(buzzListEntry);
        await user.save();

        res.json({ success: true, message: "User added to the BuzzList successfully.", buzzList: user.buzzList });

    } catch (error) {
        console.error(`Error in /addToBuzzlist: ${error.message}`);
        res.status(500).json({ success: false, message: "Server Error." });
    }
};
  
module.exports = router;
