import { loadUser } from "./home.js";

export class DomEvents {
  constructor() {
    this.todosParent = document.querySelector(".todos");
  }

  // ADD TODO TO DOM
  addTodoDOM(todoContent, status) {
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

    this.todosParent.appendChild(todo);
  }

  // SET EVENT LISTENERS
  async setEventListeners() {
    const user = await loadUser();

    // return if no todo yet
    if (!user.todos) return;

    this.doneTodo(user);
    this.editTodo(user);
    this.deleteTodo(user);
  }

  // UPDATE STATUS TODO CONTENT [DONE TODO]
  async doneTodo() {
    const users = await loadUser();
    const editTodoElements = document.querySelectorAll(".todo__edit");
    const doneTodoElements = document.querySelectorAll(".todo__done");

    // EDIT EVENT LISTENER
    for (let i = 0; i < users.todos.length; i++) {
      doneTodoElements[i].addEventListener("click", setDoneEventListener);

      async function setDoneEventListener() {
        if (editTodoElements[i].classList.contains("todo__editing")) {
          doneTodoElements[i].removeEventListener(
            "click",
            setDoneEventListener
          );
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
        console.log("done", user.todos[i]._id);

        const contentElement = document.querySelectorAll(".todo__content");

        console.log(status);
        // edit dom
        if (status === "finished") {
          contentElement[i].style.color = "red";
        } else {
          contentElement[i].style.color = "white";
        }
      }
    }
  }

  // DELETE TODO [DELETE TODO]
  async deleteTodo() {
    const users = await loadUser();
    const editTodoElements = document.querySelectorAll(".todo__edit");

    const deleteTodoElements = document.querySelectorAll(".todo__delete");
    const parentTodo = document.querySelectorAll(".todo");

    // EDIT EVENT LISTENER
    for (let i = 0; i < users.todos.length; i++) {
      deleteTodoElements[i].addEventListener("click", setDeleteEventListener);

      async function setDeleteEventListener() {
        if (editTodoElements[i].classList.contains("todo__editing")) {
          return;
        }

        parentTodo[i].remove();

        const options = {
          method: "DELETE",
        };

        await fetch(
          `/todos/delete/${users._id}/${users.todos[i]._id}`,
          options
        );
        this.setEventListeners();
        console.log("delete", users.todos[i]._id);
      }

      // TODO: DISABLE EVENT LISTENER
    }
  }

  // EDIT TODO CONTENT [EDIT TODO]
  async editTodo() {
    const user = await loadUser();
    const editTodoElements = document.querySelectorAll(".todo__edit");
    const overlay = document.querySelector(".overlay");

    const doneTodoElements = document.querySelectorAll(".todo__done");
    const deleteTodoElements = document.querySelectorAll(".todo__delete");
    const contentElement = document.querySelectorAll(".todo__content");

    // EDIT EVENT LISTENER
    for (let i = 0; i < user.todos.length; i++) {
      editTodoElements[i].addEventListener("click", setEditEventListener);
      let content = "";

      async function setEditEventListener() {
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

          doneTodoElements[i].textContent = "confirm";
          deleteTodoElements[i].textContent = "cancel";
          addEditElement[i].outerHTML = `<input
               type="text"
               class="todo__edit__content"
               placeholder="Editing ${user.todos[i].content}"
             />`;

          const editInput = document.querySelector(".todo__edit__content");
          const editConfirm = document.querySelector(".todo__edit__confirm");
          const editCancel = document.querySelector(".todo__edit__cancel");

          console.log(editInput);
          console.log(editConfirm);
          console.log(editCancel);

          editInput.addEventListener("change", (e) => {
            content = e.target.value;
          });

          editConfirm.addEventListener("click", async () => {
            if (content === "") return;

            // dom
            overlay.style.display = "none";
            doneTodoElements[i].textContent = "done";
            deleteTodoElements[i].textContent = "delete";
            doneTodoElements[i].classList.remove("todo__edit__confirm");
            deleteTodoElements[i].classList.remove("todo__edit__cancel");
            contentElement[i].classList.remove("todo__edit__content");
            doneTodoElements[i].classList.add("todo__done");
            deleteTodoElements[i].classList.add("todo__delete");

            doneTodoElements[i].classList.add("todo__done");
            deleteTodoElements[i].classList.add("todo__delete");
            const removeEditElement = document.querySelector(
              ".todo__edit__content"
            );
            removeEditElement.outerHTML = `<p class="todo__content">
            ${content}
            </p>`;
            editTodoElements[i].classList.remove("todo__editing");

            // post
            const options = {
              method: "PATCH",
              body: JSON.stringify({ content }),
              headers: {
                "Content-type": "application/json",
              },
            };
            await fetch(
              `/todos/content/${user._id}/${user.todos[i]._id}`,
              options
            );
            console.log("edit", user.todos[i]._id);
          });

          editCancel.addEventListener("click", () => {
            editTodoElements[i].classList.remove("todo__editing");
            overlay.style.display = "none";
            doneTodoElements[i].textContent = "done";
            deleteTodoElements[i].textContent = "delete";
            doneTodoElements[i].classList.remove("todo__edit__confirm");
            deleteTodoElements[i].classList.remove("todo__edit__cancel");
            contentElement[i].classList.remove("todo__edit__content");
            doneTodoElements[i].classList.add("todo__done");
            deleteTodoElements[i].classList.add("todo__delete");
            const removeEditElement = document.querySelector(
              ".todo__edit__content"
            );
            removeEditElement.outerHTML = `<p class="todo__content">
            ${user.todos[i].content}
            </p>`;
          });
        } else {
          // DISABLE EDITING
          console.log("exit editing");
          overlay.style.display = "none";

          const removeEditElement = document.querySelector(
            ".todo__edit__content"
          );

          // classlist / dom
          doneTodoElements[i].classList.remove("todo__edit__confirm");
          deleteTodoElements[i].classList.remove("todo__edit__cancel");
          contentElement[i].classList.remove("todo__edit__content");

          doneTodoElements[i].classList.add("todo__done");
          deleteTodoElements[i].classList.add("todo__delete");

          doneTodoElements[i].textContent = "done";
          deleteTodoElements[i].textContent = "delete";

          removeEditElement.outerHTML = `<p class="todo__content">
        ${user.todos[i].content}
        </p>`;

          // set done status
          const setDoneStatus = document.querySelectorAll(".todo__content");
          if (user.todos[i].status === "finished") {
            console.log("red");
            setDoneStatus[i].style.color = "red";
          }
        }
      }
    }
  }
}
