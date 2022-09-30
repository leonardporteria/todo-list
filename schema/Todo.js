const mongoose = require("mongoose");

const todoListSchema = new mongoose.Schema({
  todo: String,
  label: String,
  description: String,
  createdAt: Date,
  updatedAt: Date,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  createdAt: Date,
  updatedAt: Date,
});

module.exports = {
  User: mongoose.model("User", userSchema, "todos"),
  Todo: mongoose.model("Todo", todoListSchema, "todos"),
};
