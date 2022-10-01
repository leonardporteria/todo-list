const usernameElement = document.querySelector(".head__nav__username");
const logoutButton = document.querySelector(".head__nav__logout");

const addTodoInput = document.querySelector(".add__todo__input");
const addTodoButton = document.querySelector(".add__todo__button");

const todosParent = document.querySelector(".todos");

// LOAD USER DETAILS
async function loadUser() {
  const user = await fetch("/getUser");
  const json = await user.json();
  return json;
}

// SUBMIT TODO EVENT LISTENER ======================================
addTodoButton.addEventListener("click", async () => {
  const todoContent = addTodoInput.value;

  if (todoContent === "") return;

  addTodo(todoContent);
  addTodoDOM(todoContent);
});

// FETCH TODOS ====================================================
async function loadTodos() {
  const user = await loadUser();
  console.log(user);

  if (!user.todos) return;

  user.todos.forEach((todo) => addTodoDOM(todo.content));
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

// TODO: FETCH TODOS IN COLLECTION IF HAS TODOS
// TODO: ADD TODO IF DOESNT HAVE TODO
// TODO: FETCH ALL TODOS IN THE COLLECTION
// TODO: RENDER IN DOM

// const userData = await fetch(`/todos/${json._id}`);
// const jsonData = await userData.json();
// console.log(jsonData);
