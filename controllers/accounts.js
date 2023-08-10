// Imports
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { JWT_SECRET } = process.env;

const Account = require('../models');

// Profile Fetch
router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await Account.findById(req.user.id).select('-password'); // Removethe password from the returned data.
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Signup Route
router.post('/signup', (req, res) => {
    // POST - adding the new user to the database
    console.log('===> Inside of /signup');
    console.log('===> /register -> req.body',req.body);

    User.findOne({ email: req.body.email })
    .then(user => {
        // if email already exists, a user will come back
        if (user) {
            // send a 400 response
            return res.status(400).json({ message: 'Email already exists' });
        } else {
            // Create a new user
            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                jobTitle: req.body.jobTitle,
                birthdate: new Date(),
                "address.streetAddress": req.body.streetAddress,
                "address.city": req.body.city,
                "address.state": req.body.state,
                "address.zipCode": req.body.zipCode,
                number: req.body.number,
                password: req.body.password
            });

            // Salt and hash the password - before saving the user
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw Error;

                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) console.log('==> Error inside of hash', err);
                    // Change the password in newUser to the hash
                    newUser.password = hash;
                    newUser.save()
                    .then(createdUser => {
                        // remove password from being returned inside of response, still in DB
                        if (createdUser.password) {
                            createdUser.password = '...' // hide the password
                            res.json({ user: createdUser });
                        }
                    })
                    .catch(err => {
                        console.log('error with creating new user', err);
                        res.json({ message: 'Error occured... Please try again.'});
                    });
                });
            });
        }
    })
    .catch(err => { 
        console.log('Error finding user', err);
        res.json({ message: 'Error occured... Please try again.'})
    })
});

// Login Route
router.post('/login', async (req, res) => {
    // POST - finding a user and returning the user
    console.log('===> Inside of /login');
    console.log('===> /login -> req.body', req.body);

    const foundUser = await User.findOne({ email: req.body.email });

    if (foundUser) {
        // user is in the DB
        let isMatch = await bcrypt.compareSync(req.body.password, foundUser.password);
        console.log('Does the passwords match?', isMatch);
        if (isMatch) {
            // if user match, then we want to send a JSON Web Token
            // Create a token payload
            // add an expiredToken = Date.now()
            // save the user
            const payload = {
                id: foundUser.id,
                email: foundUser.email,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                address: foundUser.address,
                birthdate: foundUser.birthdate,
                jobTitle: foundUser.jobTitle,
                number: foundUser.number
            }

            jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
                if (err) {
                    res.status(400).json({ message: 'Session has endedd, please log in again'});
                }
                const legit = jwt.verify(token, JWT_SECRET, { expiresIn: 60 });
                console.log('===> legit', legit);
                delete legit.password; // remove before showing response
                res.json({ success: true, token: `Bearer ${token}`, userData: legit });
            });

        } else {
            return res.status(400).json({ message: 'Email or Password is incorrect' });
        }
    } else {
        return res.status(400).json({ message: 'User not found' });
    }
});

// Profile Update
router.put('/account', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const updatedUser = await Account.findByIdAndUpdate(req.user.id, req.body, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new birthday to the buzzlist
router.post('/account/buzzlist', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await Account.findById(req.user.id);
        user.publicBuzzlist.push(req.body);
        await user.save();
        res.status(200).send(user.publicBuzzlist);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update an existing birthday in the buzzlist
router.put('/account/buzzlist/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await Account.findById(req.user.id);
        const entry = user.publicBuzzlist.id(req.params.id);
        Object.assign(entry, req.body);
        await user.save();
        res.status(200).send(entry);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete an entry from the buzzlist
router.delete('/account/buzzlist/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await Account.findById(req.user.id);
        user.publicBuzzlist.id(req.params.id).remove();
        await user.save();
        res.status(200).send({ message: "Entry removed from buzzlist" });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
