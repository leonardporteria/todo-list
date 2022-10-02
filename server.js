const express = require("express");
const app = express();
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
require("dotenv").config();

const { User } = require("./schema/Todo");

// db connection
mongoose.connect("mongodb://localhost:27017/todo");
const db = mongoose.connection;

// express setup
app.listen(3000, () => console.log(`LISTENING AT PORT 3000...`));
app.use(express.static("src"));
app.use(express.json());

// USER DETAILS
let userId = {};

// ROUTES =====================================================
app.get("/", (req, res) => {
  res.sendFile("./src/index.html", { root: __dirname });
});

// GET API ===================================================
// GET ALL USERS [for checking of user's existence]
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

// GET LOGGED [get the id of the logged user]
app.get("/getUserId", (req, res) => {
  res.status(200).json(userId);
});

// GET BY ID [get the todos from the logged user]
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

// POST API =================================================
// POST NEW USER [create new user]
app.post("/todos", async (req, res) => {
  const userReq = req.body;

  try {
    const user = await User.create({
      username: userReq.username,
      password: userReq.password,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    userId = user._id;
    console.log(user);
  } catch (err) {
    console.log(err);
  }

  console.log(userId);
});

// SAVE USER ID TO SERVER [save the user id of the logged user]
app.post("/saveUser", (req, res) => {
  const user = req.body;
  userId = user._id;

  console.log(userId);
});

// POST NEW TODO [add todo to the logged user]
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

// PATCH API ================================================
// CHANGE CONTENT OF TODO BY ID [todos: {content: ''}]
app.patch("/todos/content/:id/:index", (req, res) => {
  const updates = req.body;

  if (!ObjectId.isValid(req.params.id)) {
    res.status(500).json({ error: "object id invalid" });
    return;
  }

  // FIND BY ID
  db.collection("todos")
    .updateOne(
      {
        _id: ObjectId(req.params.id),
        "todos._id": ObjectId(req.params.index),
      },
      { $set: { "todos.$.content": updates.content } }
    )
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// CHANGE STATUS OF TODO BY ID [todos: {status: ''}]
app.patch("/todos/status/:id/:index", (req, res) => {
  const updates = req.body;

  if (!ObjectId.isValid(req.params.id)) {
    res.status(500).json({ error: "object id invalid" });
    return;
  }

  // FIND BY ID
  db.collection("todos")
    .updateOne(
      {
        _id: ObjectId(req.params.id),
        "todos._id": ObjectId(req.params.index),
      },
      { $set: { "todos.$.status": updates.status } }
    )
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// DELETE API ===============================================
// DELETE TODO BY ID
app.delete("/todos/delete/:id/:index", (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(500).json({ error: "object id invalid" });
    return;
  }

  db.collection("todos")
    .updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      { $pull: { todos: { _id: ObjectId(req.params.index) } } },
      false,
      true
    )
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// URL PATH =================================================
app.get("/home", (req, res) => {
  res.sendFile("./src/home.html", { root: __dirname });
});

app.use((req, res) => {
  res.status(404).sendFile("./src/index.html", { root: __dirname });
});
