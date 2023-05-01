export function storeUserObj(name, value) {
  if (name && value) {
    sessionStorage.setItem(name, value);
  }else{
    console.log("Storing Invalid Item");
  }
}

export function getUserObj() {
  const access_token = sessionStorage.getItem('user');
  return user;
}

export function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export function getJwt() {
  const jwtStr = sessionStorage.getItem('jwt');
  const jwt = JSON.parse(jwtStr);
  return jwt;
}