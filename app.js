const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("./config/passport")(passport);
const { User } = require("./models");

const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

//----GET---- get all users on the app
app.get("/users", (req, res) => {
  User.find().then((allUsers) => {
    console.log("All Users: ", allUsers);
    res.json(allUsers);
  });
});

//----GET---- get all people from your Buzz List
app.get(
  "/buzzlist/:email",
  //passport.authenticate("jwt", { session: true }),  this is causing user to continually be rerouted to login page after logging in
  (req, res) => {
    console.log("Email", req.params.email);
    User.findOne({ email: req.params.email })
      .then((foundUser) => {
        console.log(`Found user: ${foundUser}`);
        buzzlist = foundUser.buzzList;
        console.log("Buzzlist: ", buzzlist);
        return res.json(buzzlist);
      })
      .catch((error) => {
        console.log(`Error finding user: ${error}`);
        return res.json({ Error: "User not found" });
      });
  }
);

//----POST---- add a person to your Buzz List
app.post(
  "/buzzlist/new",
  //passport.authenticate("jwt", { session: true }),  this is causing user to continually be rerouted to login page after logging in
  (req, res) => {
    User.findOne({ email: req.body.user.email })
      .then((foundUser) => {
        console.log(`Found user: ${foundUser.email}`);
        console.log("New Buzz Request: ", req.body.newPerson);
        foundUser.buzzList.push(req.body.newPerson); //Update to just splice out email rather then sending it in two different objects (will also have to chang how data is being sent)
        foundUser
          .save()
          .then((updatedUser) => {
            console.log("Updated Buzzlist: ", updatedUser.buzzList);
            return res.json({ success: true });
          })
          .catch((error) => {
            console.log(`Error saving new Buzz List entry: ${error}`);
            return res.json({ success: false });
          });
      })
      .catch((error) => {
        console.log(`Error finding user: ${error}`);
        return res.json({ success: false });
      });
  }
);

//----Delete---- remove a person from your Buzz List
app.delete("/buzzlist/:user/:id", (req, res) => {
  console.log(
    `${req.params.user} requests ${req.params.id} to be removed from their buzzlist`
  );
  User.updateOne(
    { email: req.params.user },
    {
      $pull: { buzzList: { _id: req.params.id } },
    }
  )
    .then((response) => {
      console.log("Response: ", response);
      res.json(response.acknowledged);
    })
    .catch((error) => {
      console.log("Error removing entry from Buzz List: ", error);
      res.json("Error removing entry from Buzz List");
    });
});

app.use("/auth", require("./controllers/auth"));
app.use("/account", require("./controllers/account"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server connected to PORT: ${PORT}`);
});

module.exports = app;
