  // Can't use require in broswer environments
  // const http = require('http');

  let request = new XMLHttpRequest();
  const url = `127.0.0.1/login`

  JWT = ""

  let _headers = {
      'Authentication': `Bearer ${JWT}`
  }

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
    body: auth,
    headers: _headers
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
  
  // wait 3 seconds before loading next page
  // setTimeout(function() {
  //   window.location.href = url;
  // }, 3000);