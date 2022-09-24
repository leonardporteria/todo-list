const mongoose = require("mongoose");

const todoListSchema = new mongoose.Schema({
  todo: String,
  label: String,
  description: String,
  createdAt: Date,
  updatedAt: Date,
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  createdAt: Date,
  updatedAt: Date,
  body: todoListSchema,
});

module.exports = mongoose.model("Todo", userSchema);
