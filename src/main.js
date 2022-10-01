const registerUsername = document.querySelector(".register__username__input");
const registerPassword = document.querySelector(".register__password__input");
const regUsernameLabel = document.querySelector(".register__username__label");
const regPassLabel = document.querySelector(".register__password__label");

const loginUsername = document.querySelector(".login__username__input");
const loginPassword = document.querySelector(".login__password__input");
const logUsernameLabel = document.querySelector(".login__username__label");
const logPassLabel = document.querySelector(".login__password__label");

const registerBtn = document.querySelector(".register__submit");
const loginBtn = document.querySelector(".login__submit");

// LOAD DATABASE COLLECTIONS
async function load() {
  const res = await fetch("/todos");
  const users = await res.json();
  return users;
}

// REGISTER / SIGNUP EVENT LISTENER
registerBtn.addEventListener("click", async () => {
  const usernameValue = registerUsername.value;
  const passwordValue = registerPassword.value;
  let hasUser = false;

  // check username if not empty
  if (usernameValue === "") {
    regUsernameLabel.textContent = "Please Provide Input";
    return;
  }
  // check username lenght
  if (usernameValue.length < 5) {
    regUsernameLabel.textContent = "Too Short";
    return;
  }
  if (usernameValue.length > 15) {
    regUsernameLabel.textContent = "Too Long";
    return;
  }

  const users = await load();
  users.forEach((user) => {
    if (user.username === usernameValue) {
      hasUser = true;
    }
  });

  // check for duplicate users
  if (hasUser) {
    regUsernameLabel.textContent = `Username Already Taken`;
    regUsernameLabel.style.color = "#ac1111";
    return;
  } else {
    regUsernameLabel.textContent = `Username Available`;
    regUsernameLabel.style.color = "#005813";
  }

  // check password if not empty
  if (passwordValue === "") {
    regPassLabel.textContent = "Please Provide Input";
    return;
  }
  // check username lenght
  if (passwordValue.length < 8) {
    regPassLabel.textContent = "Too Short";
    return;
  }
  if (passwordValue.length > 15) {
    regPassLabel.textContent = "Too Long";
    return;
  }

  location.replace("./home");

  const data = {
    username: usernameValue,
    password: passwordValue,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const response = await fetch("/todos", options);
  console.log(response);
});

// LOGIN EVENT LISTENER
loginBtn.addEventListener("click", async () => {
  const usernameValue = loginUsername.value;
  const passwordValue = loginPassword.value;
  const users = await load();
  let isUser = false;
  let userDetails = {};

  // check username if not empty
  if (usernameValue === "") {
    logUsernameLabel.textContent = "Please Provide Input";
    return;
  }

  // save user's details based on username givne
  users.forEach((user) => {
    if (user.username === usernameValue) {
      isUser = true;
      userDetails = user;
    }
  });

  // check user's existence
  if (isUser) {
    logUsernameLabel.textContent = `Username`;
    logUsernameLabel.style.color = "#f5f5f5";
  } else {
    logUsernameLabel.textContent = `Username does not exist`;
    logUsernameLabel.style.color = "#ac1111";
    return;
  }

  // check password if not empty
  if (passwordValue === "") {
    logPassLabel.textContent = "Please Provide Input";
    return;
  }

  // check password
  if (!(passwordValue === userDetails.password)) {
    logPassLabel.textContent = "Wrong Password!";
    logPassLabel.style.color = "#ac1111";
    return;
  } else {
    logPassLabel.textContent = "Login Granted";
    logPassLabel.style.color = "#005813";
  }

  location.replace("./home");

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDetails),
  };
  const response = await fetch("/saveUser", options);
  console.log(response);
});
