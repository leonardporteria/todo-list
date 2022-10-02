const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  createdAt: Date,
  updatedAt: Date,
});

module.exports = {
  User: mongoose.model("User", userSchema, "todos"),
};
