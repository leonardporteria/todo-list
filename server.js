const express = require("express");
const app = express();
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
require("dotenv").config();

const { User, Todo } = require("./schema/Todo");

// db connection
mongoose.connect("mongodb://localhost:27017/todo");
const db = mongoose.connection;

// express setup
app.listen(3000, () => console.log(`LISTENING AT PORT 3000...`));
app.use(express.static("src"));
app.use(express.json());

// USER DETAILS
let userData = {};

// ROUTES =====================================================
app.get("/", (req, res) => {
  res.sendFile("./src/index.html", { root: __dirname });
});

// GET ALL USERS
app.get("/todos", (req, res) => {
  let users = [];

  db.collection("todos")
    .find()
    .forEach((user) => users.push(user))
    .then(() => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// GET LOGGED
app.get("/getUser", (req, res) => {
  res.status(200).json(userData);
});

// GET BY ID
app.get("/todos/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(500).json({ error: "object id invalid" });
    return;
  }

  db.collection("todos")
    .findOne({ _id: ObjectId(req.params.id) })
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// POST NEW USER
app.post("/todos", async (req, res) => {
  const userReq = req.body;

  try {
    const user = await User.create({
      username: userReq.username,
      password: userReq.password,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    userData = user;
    console.log(user);
  } catch (err) {
    console.log(err);
  }

  console.log(userData);
});

// SAVE USE DATA TO SERVER
app.post("/saveUser", (req, res) => {
  const user = req.body;
  userData = user;

  console.log(userData);
});

// POST NEW TODO
app.post("/todos/:id", (req, res) => {
  const set = {
    todos: {
      content: req.body.content,
      status: "unfinished",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      _id: new mongoose.mongo.ObjectId(),
    },
  };

  if (!ObjectId.isValid(req.params.id)) {
    res.status(500).json({ error: "object id invalid" });
    return;
  }

  db.collection("todos")
    .updateOne({ _id: ObjectId(req.params.id) }, { $push: set })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// PATCH TODO BY ID

// URL PATH =====================================================
app.get("/home", (req, res) => {
  res.sendFile("./src/home.html", { root: __dirname });
});

app.use((req, res) => {
  res.status(404).sendFile("./src/index.html", { root: __dirname });
});
