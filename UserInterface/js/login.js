function validateUser() {
  event.preventDefault();

  const username = document.getElementById('usernameTextbox').value;
  const password = document.getElementById('passwordTextbox').value;

  const user = {
    "username": username,
    "password": password
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  }

  fetch('http://192.168.1.94:5000/login', options)
  .then((res) => {
    if (res.ok) {
      showThankYou();
      setTimeout(function() {
        window.location.href = 'home.html';
      }, 3000);
    }else{
      console.log("Invalid Credentials");
      document.getElementById("invalidCreds").style.visibility = 'visible';
    }
  })
}