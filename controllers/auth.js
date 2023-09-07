// Imports
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const { CourierClient } = require("@trycourier/courier");
const courier = CourierClient({
  authorizationToken: process.env.COURIER_API_KEY,
});
let verificationCode;

// import the User model
const { User } = require("../models");

// Return all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

function generateVerificationCode() {
  let numbers = [];
  for (let i = 0; i < 4; i++) {
    numbers.push(Math.floor(Math.random() * 10));
  }
  return parseInt(numbers.join(""));
}

router.post("/verify", async (req, res) => {
  User.findOne({ email: req.body.email.toString() })
    .then((foundUser) => {
      console.log(`${foundUser.email} is already registered`);
      return res.status(401).send({
        message: `${foundUser.email} is already registered`,
      });
    })
    .catch(async (error) => {
      // Generate a verification code and print it to the console.
      verificationCode = generateVerificationCode();
      console.log(verificationCode);
      // Send verification email
      const requestId = await courier.send({
        message: {
          to: {
            email: req.body.email.toString(),
          },
          content: {
            title: "Welcome!",
            body: `Thanks for signing up!  Your verification code is ${verificationCode}`,
          },
          data: {
            name: "Feature comming soon",
          },
          routing: {
            method: "single",
            channels: ["email"],
          },
        },
      });
      if (requestId) {
        console.log("Verification code sent to", req.body.email.toString());
        res
          .status(202)
          .send(`Verification code sent to ${req.body.email.toString()}`);
      } else {
        console.log("Request Id: ", requestId);
        res.status(401).send({ message: "Verification code not sent..." });
      }
    });
});

router.get("/checkVerify/:email/:code", async (req, res) => {
  console.log(`Code: ${parseInt(req.params.code)}, Match: ${verificationCode}`);
  try {
    if (parseInt(req.params.code) === verificationCode) {
      res.json({
        message: `Verification SID for: ${req.params.email} is valid`,
      });
    } else {
      throw new error();
    }
  } catch (error) {
    console.log(`Code does not match`);
    res.status(401).send({
      message: "Code does not match",
    });
  }
});

// POST - finding a user and returning the user
router.post("/login", async (req, res) => {
  const foundUser = await User.findOne({ email: req.body.email.toLowerCase() });
  if (foundUser) {
    let isMatch = await bcrypt.compareSync(
      req.body.password,
      foundUser.password
    );
    console.log("Does the passwords match?", isMatch);
    if (isMatch) {
      const payload = {
        id: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        birthday: foundUser.birthday,
        email: foundUser.email,
        password: foundUser.password,
      };
      jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
        if (err) {
          res
            .status(401)
            .send({ message: "Session timed out, please log in again" });
        }
        const legit = jwt.verify(token, JWT_SECRET, { expiresIn: 60 });
        console.log("Verify: ", legit);
        delete legit.password; // remove password before showing response
        res.json({ success: true, token: `Bearer ${token}`, userData: legit });
      });
    } else {
      return res.status(401).send({ message: "Email or Password incorrect" });
    }
  } else {
    return res.status(401).send({ message: "Email not registered" });
  }
});

// POST - adding the new user to the database
router.post("/signup", (req, res) => {
  console.log("POST to /signup");
  console.log("Register Request: ", req.body);
  User.findOne({ email: req.body.email })
    .then((user) => {
      // If a user is already registered under that username
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        // Create a new user
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          birthday: req.body.birthday,
          email: req.body.email.toLowerCase(),
          password: req.body.password,
          buzzTime: ["8", "30", "AM"],
          timezone: "UTC",
        });

        // Salt and hash the password - before saving the user
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw Error;
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.log("==> Error inside of hash", err);
            // Change the password in newUser to the hash
            newUser.password = hash;
            newUser
              .save()
              .then((createdUser) => {
                // remove password from being returned inside of response, still in DB
                if (createdUser.password) {
                  createdUser.password = "..."; // hide the password
                  res.json({ user: createdUser });
                }
              })
              .catch((err) => {
                console.log("Error creating new user", err);
                res.json({ message: "Error occured... Please try again." });
              });
          });
        });
      }
    })
    .catch((err) => {
      console.log("Error finding user", err);
      res.json({ message: "Error occured... Please try again." });
    });
});

module.exports = router;

//----------------------------------------------------Template's code for updating a user
// router.put('/:id', (req, res) => {
//     const updateQuery = {}
//     // check firstName
//     if (req.body.firstName) {
//         updateQuery.firstName = req.body.firstName
//     }
//     // check lastName
//     if (req.body.lastName) {
//         updateQuery.lastName = req.body.lastName
//     }
//     // check email
//     if (req.body.email) {
//         updateQuery.email = req.body.email
//     }
//     // check jobTitle
//     if (req.body.jobTitle) {
//         updateQuery.jobTitle = req.body.jobTitle
//     }
//     // check bithdate
//     if (req.body.bithdate) {
//         updateQuery.bithdate = req.body.bithdate
//     }
//     // check streetAddress
//     if (req.body.streetAddress) {
//         updateQuery["address.streetAddress"] = req.body.streetAddress
//     }
//     // check city
//     if (req.body.city) {
//         updateQuery["address.city"] = req.body.city
//     }
//     // check state
//     if (req.body.state) {
//         updateQuery["address.state"] = req.body.state
//     }
//     // check zipCode
//     if (req.body.zipCode) {
//         updateQuery["address.zipCode"]  = req.body.zipCode
//     }
//     // check number
//     if (req.body.number) {
//         updateQuery.number = req.body.number
//     }

//     User.findByIdAndUpdate(req.params.id, {$set: updateQuery }, {new: true})
//     .then((user) => {
//         return res.json({ message: `${user.email} was updated`, user: user});
//     })
//     .catch((error) => {
//         console.log('error inside PUT /users/:id', error);
//         return res.json({ message: 'error occured, please try again.' });
//     });
// });

//----------------------------------------------------Template's code for deleting a user:
// DELETE route for /users/:id
// router.delete('/:id', (req, res) => {
//     User.findByIdAndDelete(req.params.id)
//     .then((result) => {
//         return res.json({ message: `user at ${req.params.id} was delete`});
//     })
//     .catch((error) => {
//         console.log('error inside DELETE /users/:id', error);
//         return res.json({ message: 'error occured, please try again.' });
//     });
// });

//----------------------------------------------------Use as example for authorized access only pages in other routes:
// router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
//     console.log('====> inside /profile');
//     console.log(req.body);
//     console.log('====> user')
//     console.log(req.user);
//     const { id, firstName, lastName, email, address, jobTitle, birthdate, number } = req.user; // object with user object inside
//     res.json({ id, firstName, lastName, email, address, jobTitle, birthdate, number });
// });
