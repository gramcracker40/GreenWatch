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

  fetch('http://127.0.0.1:5000/login', options)
  .then((res) => {
    if (res.ok) {
      document.getElementById("invalidCreds").style.visibility = 'hidden';
      showThankYou();
      setTimeout(function() {
        window.location.href = '/home';
      }, 3000);
    }else{
      console.log("Invalid Credentials");
      document.getElementById("invalidCreds").style.visibility = 'visible';
    }
  })
}