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

// ROUTES
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

  console.log(req.body);
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

// POST
app.post("/todos", (req, res) => {
  const user = req.body;

  createUser(user.username, user.password);
});

async function createUser(usernameRes, passwordRes) {
  try {
    const user = await User.create({
      username: usernameRes,
      password: passwordRes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log(user);
  } catch (err) {
    console.log(err);
  }
}

// DELETE BY ID
app.delete("/todos/:id", (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(500).json({ error: "object id invalid" });
    return;
  }

  db.collection("todos")
    .deleteOne({ _id: ObjectId(req.params.id) })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// UPDATE BY ID
app.patch("/todos/:id", (req, res) => {
  const updates = req.body;

  addTodo(ObjectId(req.params.id));

  if (!ObjectId.isValid(req.params.id)) {
    res.status(500).json({ error: "object id invalid" });
    return;
  }

  db.collection("todos")
    .updateOne({ _id: ObjectId(req.params.id) }, { $set: updates })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// HELPER FUNCTIONS

async function addTodo(oId) {
  const updates = {
    todos: {
      todo: "test",
      label: "test",
      description: "test",
    },
  };
  // push update
  //pull old

  // db.collection("todos")
  //   .updateOne({ _id: ObjectId(oId) }, { $set: updates })
  //   .then((result) => {
  //     res.status(200).json(result);
  //   })
  //   .catch((err) => {
  //     res.status(500).json({ error: err });
  //   });
}
