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

//--GET Profile
router.get("/:email", (req, res) => {
  User.find({ email: req.params.email })
    .then((foundUser) => {
      console.log("Found user: ", foundUser);
      res.json(foundUser);
    })
    .catch((error) => {
      console.log("Error finding user: ", error);
      res.json("Error finding user: ");
    });
});

router.put("/edit/:email", (req, res) => {
  const updateQuery = req.body;

  User.updateOne(
    { email: req.params.email },
    { $set: updateQuery },
    { new: true }
  )
    .then((updatedUser) => {
      console.log("Updated User: ", updatedUser);
      res.json({ message: `${updatedUser.email} was updated` });
    })
    .catch((error) => {
      console.log("error inside PUT /account/:id", error);
      res.json({ message: "error occured, please try again." });
    });
});

router.delete("/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      return res.json({ message: `${user.email} was deleted` });
    })
    .catch((error) => {
      console.log("error inside DELETE /account/:id", error);
      return res.json({ message: "error occured, please try again." });
    });
});

router.get("/searchUsers", async (req, res) => {
  const searchQuery = req.query.query;
  console.log("searchQuery", searchQuery);

  if (!searchQuery) {
    return res.status(400).json({ error: "Query parameter is required." });
  }

  try {
    const users = await User.find({
      firstName: new RegExp(searchQuery, "i"),
    });

    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.addToBuzzlist = async (req, res) => {
  const {
    userIdToAdd,
    relation,
    reminderTimeFrame,
    delivery_system,
    message,
    public,
  } = req.body;

  // Check if all required details are present
  if (!userIdToAdd) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid user data provided." });
  }

  try {
    // Fetch the user whose BuzzList will be updated
    const user = await User.findById(req.user._id); // Assuming req.user._id contains the logged-in user's ID, which should be set by your authentication middleware

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Logged-in user not found." });
    }

    // Fetch the user data that will be added to the BuzzList
    const userToAdd = await User.findById(userIdToAdd);

    if (!userToAdd) {
      return res
        .status(404)
        .json({ success: false, message: "User to add not found." });
    }

    // Create the BuzzList entry
    const buzzListEntry = {
      name: `${userToAdd.firstName} ${userToAdd.lastName}`,
      birthday: userToAdd.birthday,
      relation,
      reminderTimeFrame,
      delivery_system,
      message,
      public,
    };

    // Add to the user's BuzzList
    user.buzzList.push(buzzListEntry);
    await user.save();

    res.json({
      success: true,
      message: "User added to the BuzzList successfully.",
      buzzList: user.buzzList,
    });
  } catch (error) {
    console.error(`Error in /addToBuzzlist: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error." });
  }
};

//Correct way to auth?
// router.get(
//     "/:email",
//     passport.authenticate("jwt", { session: false }),
//     (req, res) => {

module.exports = router;
