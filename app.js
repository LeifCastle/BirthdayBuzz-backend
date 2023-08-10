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

app.get(
  "/buzzlist/:email",
  // passport.authenticate("jwt", { session: true }),
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

app.use("/auth", require("./controllers/auth"));
//app.use("/account", require("./controllers/account"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server connected to PORT: ${PORT}`);
});

module.exports = app;
