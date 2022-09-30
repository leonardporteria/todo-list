const registerUsername = document.querySelector(".register__username__input");
const registerPassword = document.querySelector(".register__password__input");
const loginUsername = document.querySelector(".login__username__input");
const loginPassword = document.querySelector(".login__password__input");
const registerBtn = document.querySelector(".register__submit");
const loginBtn = document.querySelector(".login__submit");

registerBtn.addEventListener("click", () => {
  const username = registerUsername.value;
  const password = registerPassword.value;
  console.log(username, password);
});

loginBtn.addEventListener("click", () => {
  const username = loginUsername.value;
  const password = loginPassword.value;
  console.log(username, password);
});
