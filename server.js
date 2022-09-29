const express = require("express");
const app = express();
const { ObjectId } = require("mongodb");
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

// DEFAULT ENDPOINT
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
  const todo = req.body;

  db.collection("todos")
    .insertOne(todo)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

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
  // process
  // > remove old todo object by id
  // > create new todo schema
  // > add to the collection

  const updates = req.body;

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
async function createUser() {
  try {
    const user = await Todo.create({
      email: "test2@email.com",
      password: "password",
      username: "userUsername2",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      body: {
        todo: "to do stuff2",
        label: "important2",
        description: "to do this stuff2",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    });
    console.log(user);
  } catch (err) {
    console.log(err);
  }
}

async function addTodo() {
  try {
    const user = await Users.create({
      email: "test2@email.com",
      password: "password",
      username: "userUsername2",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      body: {
        todo: "to do stuff2",
        label: "important2",
        description: "to do this stuff2",
      },
    });
    console.log(user);
  } catch (err) {
    console.log(err);
  }
}
