const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const Todo = require("./schema/Todo");

// db connection
mongoose.connect("mongodb://localhost:27017/todo");
const db = mongoose.connection;

// express setup
app.listen(3000, () => console.log(`LISTENING AT PORT 3000...`));
app.use(express.static("src"));
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {
  res.sendFile("./src/index.html", { root: __dirname });
});

// default endpoint
app.get("/todo-list", (req, res) => {
  let users = [];

  db.collection("users")
    .find()
    .sort({ author: 1 })
    .forEach((user) => users.push(user))
    .then(() => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// get userId endpoint

// delete userId endpoint

// update userId endpoint

// HELPER FUNCTIONS
async function createUser() {
  try {
    const user = await Todo.create({
      email: "test2@email.com",
      password: "password",
      username: "userUsername2",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      // body: {
      //   todo: "to do stuff2",
      //   label: "important2",
      //   description: "to do this stuff2",
      //   createdAt: Date.now(),
      //   updatedAt: Date.now(),
      // },
    });
    console.log(user);
  } catch (err) {
    console.log(err);
  }
}
