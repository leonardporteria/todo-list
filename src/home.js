import { DomEvents } from "./events.js";

const domEvents = new DomEvents();

const usernameElement = document.querySelector(".head__nav__username");
const logoutButton = document.querySelector(".head__nav__logout");

const addTodoInput = document.querySelector(".add__todo__input");
const addTodoButton = document.querySelector(".add__todo__button");

// LOAD USER DETAILS
export async function loadUser() {
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
  domEvents.addTodoDOM(todoContent);
  domEvents.setEventListeners();
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

  user.todos.forEach((todo) => domEvents.addTodoDOM(todo.content, todo.status));

  domEvents.setEventListeners();
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
