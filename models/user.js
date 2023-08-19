const mongoose = require("mongoose");

// BuzzList schema (embedded document)
const buzzListSchema = new mongoose.Schema(
  {
    name: String,
    birthday: String,
    relation: String,
    reminderTimeFrame: Array,
    delivery_system: String,
    message: String,
    public: Boolean,
  },
  { timestamps: true }
);

// User schema
const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    birthday: String,
    email: String,
    password: { type: String, required: true },
    buzzList: [buzzListSchema],
    public_buzzList_users: Array,
  },
  { timestamps: true }
);

// Create model
const User = mongoose.model("User", userSchema);

// Export the model
module.exports = User;
