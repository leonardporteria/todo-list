const usernameElement = document.querySelector(".head__nav__username");
const logoutButton = document.querySelector(".head__nav__logout");

const addTodoInput = document.querySelector(".add__todo__input");
const addTodoButton = document.querySelector(".add__todo__button");

const todosParent = document.querySelector(".todos");

// LOAD USER DETAILS
async function loadUser() {
  const user = await fetch("/getUserId");
  const json = await user.json();

  const userData = await fetch(`/todos/${json}`);
  const jsonData = await userData.json();
  return jsonData;
}

// SUBMIT TODO EVENT LISTENER ======================================
addTodoButton.addEventListener("click", async () => {
  const todoContent = addTodoInput.value;

  if (todoContent === "") return;

  addTodo(todoContent);
  addTodoDOM(todoContent);
  setEventListeners();
});

// logout button
logoutButton.addEventListener("click", async () => {
  location.replace("/");
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ _id: "" }),
  };
  await fetch("/saveUser", options);
});

// FETCH TODOS ====================================================
async function loadTodos() {
  const user = await loadUser();
  console.log(user);

  usernameElement.textContent = user.username;
  document.title = `TODO LIST | ${user.username}`;

  if (!user.todos) return;

  user.todos.forEach((todo) => addTodoDOM(todo.content));

  setEventListeners();
}
loadTodos();

// CREATE/ADD TODOS
async function addTodo(todoContent) {
  const user = await loadUser();

  const todos = {
    content: todoContent,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todos),
  };
  const response = await fetch(`/todos/${user._id}`, options);
  console.log(response);
}

// ADD TODO TO DOM
function addTodoDOM(todoContent) {
  const todo = document.createElement("div");
  const content = document.createElement("p");
  const doneButton = document.createElement("p");
  const editButton = document.createElement("p");
  const deleteButton = document.createElement("p");

  todo.classList.add("todo");
  content.classList.add("todo__content");
  doneButton.classList.add("todo__done");
  editButton.classList.add("todo__edit");
  deleteButton.classList.add("todo__delete");

  content.textContent = todoContent;
  doneButton.textContent = "done";
  editButton.textContent = "edit";
  deleteButton.textContent = "delete";

  todo.appendChild(content);
  todo.appendChild(doneButton);
  todo.appendChild(editButton);
  todo.appendChild(deleteButton);

  todosParent.appendChild(todo);
}

// EDIT TODOS
async function setEventListeners() {
  doneTodo();
  editTodo();
  deleteTodo();
}

// UPDATE STATUS TODO CONTENT [DONE TODO]
async function doneTodo() {
  const user = await loadUser();
  const doneTodoElements = document.querySelectorAll(".todo__done");

  const status = "finished";

  const options = {
    method: "PATCH",
    body: JSON.stringify({ status }),
    headers: {
      "Content-type": "application/json",
    },
  };

  console.log("done todo");

  // EDIT EVENT LISTENER
  for (let i = 0; i < user.todos.length; i++) {
    doneTodoElements[i].addEventListener("click", async () => {
      console.log("done", user.todos[i]._id);
      await fetch(`/todos/status/${user._id}/${user.todos[i]._id}`, options);
    });
  }
}

// EDIT TODO CONTENT [EDIT TODO]
async function editTodo() {
  const user = await loadUser();
  const editTodoElements = document.querySelectorAll(".todo__edit");

  const content = "edit langs";

  const options = {
    method: "PATCH",
    body: JSON.stringify({ content }),
    headers: {
      "Content-type": "application/json",
    },
  };

  console.log("edit todo");

  // EDIT EVENT LISTENER
  for (let i = 0; i < user.todos.length; i++) {
    editTodoElements[i].addEventListener("click", async () => {
      console.log("edit", user.todos[i]._id);
      await fetch(`/todos/content/${user._id}/${user.todos[i]._id}`, options);
    });
  }
}

// DELETE TODO [DELETE TODO]
async function deleteTodo() {
  const user = await loadUser();
  const deleteTodoElements = document.querySelectorAll(".todo__delete");

  const options = {
    method: "DELETE",
  };

  console.log("delete todo");

  // EDIT EVENT LISTENER
  for (let i = 0; i < user.todos.length; i++) {
    deleteTodoElements[i].addEventListener("click", async () => {
      console.log("delete", user.todos[i]._id);
      await fetch(`/todos/delete/${user._id}/${user.todos[i]._id}`, options);
    });
  }
}
