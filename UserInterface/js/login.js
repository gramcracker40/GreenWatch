const http = require('http');



// let authTokens = {
//     'Content-Type': 'application/json',
//     'Authentication': token
// }

JWT = ""

// const token = Bearer ${JWT}

const auth = {
    "username": "kpuilliam",
    "password": "CrazyPasswordBro"
}

const options = {
  port: 5000,
  hostname: '127.0.0.1',
  path: '/login',
  method: 'POST',
  body: auth
};

const req = http.request(options, res => {
  let responseData = '';
  res.on('data', chunk => {
    responseData += chunk;
  });
  res.on('end', () => {
    // Success! Parse the response as JSON
    let jsonResponse = JSON.parse(responseData);
    console.log(jsonResponse);
  });
});

req.on('error', error => {
  // Handle errors here
  console.error(error);
});

req.end();