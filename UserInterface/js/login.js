import { GreenhouseProxy } from "../api/api.js";

const proxy = new GreenhouseProxy();

const submitBtn = document.getElementById('submit-btn');
submitBtn.addEventListener('click', validateUser);

const invalidLoginText = document.getElementById('invalidCreds');

async function validateUser() {
  const username = document.getElementById('usernameTextbox').value;
  const password = document.getElementById('passwordTextbox').value;

  const user = {
    "username": username,
    "password": password
  }

  const jwt = await proxy.login(user);
  if (jwt) {
    invalidLoginText.style.visibility = 'hidden';

    const jwtStr = JSON.stringify(jwt);
    sessionStorage.setItem('jwt', jwtStr);

    sessionStorage.setItem('access_token', jwt['access_token']);
    sessionStorage.setItem('refresh_token', jwt['refresh_token']);
    window.location.assign('/home');
  }else{
    invalidLoginText.style.visibility = 'visible';
    // console.log("login failed");
  }
  // console.log(jwt);
}