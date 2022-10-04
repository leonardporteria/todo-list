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

  user.todos.forEach((todo) => addTodoDOM(todo.content, todo.status));

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
function addTodoDOM(todoContent, status) {
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

  if (status === "finished") content.style.color = "#ac1111";

  todo.appendChild(content);
  todo.appendChild(doneButton);
  todo.appendChild(editButton);
  todo.appendChild(deleteButton);

  todosParent.appendChild(todo);
}

// SET EVENT LISTENERS =====================================================
async function setEventListeners() {
  const user = await loadUser();

  // return if no todo yet
  if (!user.todos) return;

  doneTodo(user);
  editTodo(user);
  deleteTodo(user);
}

// UPDATE STATUS TODO CONTENT [DONE TODO]
async function doneTodo(users) {
  const editTodoElements = document.querySelectorAll(".todo__edit");
  const doneTodoElements = document.querySelectorAll(".todo__done");

  // EDIT EVENT LISTENER
  for (let i = 0; i < users.todos.length; i++) {
    doneTodoElements[i].addEventListener("click", async () => {
      if (editTodoElements[i].classList.contains("todo__editing")) {
        return;
      }

      const user = await loadUser();
      const status =
        user.todos[i].status === "unfinished" ? "finished" : "unfinished";

      const options = {
        method: "PATCH",
        body: JSON.stringify({ status }),
        headers: {
          "Content-type": "application/json",
        },
      };

      await fetch(`/todos/status/${user._id}/${user.todos[i]._id}`, options);

      const contentElement = document.querySelectorAll(".todo__content");

      console.log(status);
      // edit dom
      if (status === "finished") {
        contentElement[i].style.color = "red";
      } else {
        contentElement[i].style.color = "white";
      }

      console.log("done", user.todos[i]._id);
    });
  }
}

// EDIT TODO CONTENT [EDIT TODO]
async function editTodo(users) {
  const user = await loadUser();
  const editTodoElements = document.querySelectorAll(".todo__edit");
  const overlay = document.querySelector(".overlay");

  const doneTodoElements = document.querySelectorAll(".todo__done");
  const deleteTodoElements = document.querySelectorAll(".todo__delete");
  const contentElement = document.querySelectorAll(".todo__content");

  // EDIT EVENT LISTENER
  for (let i = 0; i < users.todos.length; i++) {
    editTodoElements[i].addEventListener("click", async () => {
      editTodoElements[i].classList.toggle("todo__editing");

      if (editTodoElements[i].classList.contains("todo__editing")) {
        // ACTIVE EDITING
        console.log("editing");
        const addEditElement = document.querySelectorAll(".todo__content");
        overlay.style.display = "block";

        // classlist
        doneTodoElements[i].classList.remove("todo__done");
        deleteTodoElements[i].classList.remove("todo__delete");
        contentElement[i].classList.remove("todo__content");

        doneTodoElements[i].classList.add("todo__edit__confirm");
        deleteTodoElements[i].classList.add("todo__edit__cancel");

        addEditElement[i].outerHTML = `<input
             type="text"
             class="todo__edit__content"
             placeholder="Editing ${user.todos[i].content}"
           />`;
      } else {
        // DISABLE EDITING
        console.log("exit editing");
        const removeEditElement = document.querySelector(
          ".todo__edit__content"
        );
        overlay.style.display = "none";

        // classlist
        doneTodoElements[i].classList.remove("todo__edit__confirm");
        deleteTodoElements[i].classList.remove("todo__edit__cancel");
        contentElement[i].classList.remove("todo__edit__content");

        doneTodoElements[i].classList.add("todo__done");
        deleteTodoElements[i].classList.add("todo__delete");

        removeEditElement[i].outerHTML = `<p class="todo__content">
      ${user.todos[i].content}
      </p>`;
        const newTodo = document.querySelectorAll(".todo__content");
        if (user.todos[i].status === "finished") {
          console.log("red");
          newTodo[i].style.color = "red";
        }
      }

      const content = "edit langs";

      const options = {
        method: "PATCH",
        body: JSON.stringify({ content }),
        headers: {
          "Content-type": "application/json",
        },
      };

      await fetch(`/todos/content/${user._id}/${user.todos[i]._id}`, options);

      console.log("edit", user.todos[i]._id);
    });
  }
}

// DELETE TODO [DELETE TODO]
async function deleteTodo(users) {
  const editTodoElements = document.querySelectorAll(".todo__edit");

  const deleteTodoElements = document.querySelectorAll(".todo__delete");
  const parentTodo = document.querySelectorAll(".todo");

  // EDIT EVENT LISTENER
  for (let i = 0; i < users.todos.length; i++) {
    deleteTodoElements[i].addEventListener("click", async () => {
      if (editTodoElements[i].classList.contains("todo__editing")) {
        return;
      }

      parentTodo[i].remove();

      const options = {
        method: "DELETE",
      };

      await fetch(`/todos/delete/${users._id}/${users.todos[i]._id}`, options);

      console.log("delete", users.todos[i]._id);
      const user = await loadUser();
      deleteTodo(user);
    });
  }
}
