export const MAX_NAME_LENGTH = 30;

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Nov",
  "Dec"
]

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

export function logout() {
  sessionStorage.clear();
}

export function toStandardTime(_hours) {
  let hours = _hours;
  let amPm = '';
  if (hours > 12) {
    amPm = 'PM';
    hours -= 12;
  } else if (hours == 0) {
    amPm = 'AM';
    hours = "12";
  }else if (hours < 12) {
    amPm = 'AM';
  }else{
    amPm = 'PM';
  }

  const hoursObj = {
    hours: hours,
    amPm: amPm
  }

  return hoursObj;
}

export function download(data, filename) {
 
  // Creating a Blob for having a csv file format
  // and passing the data with type
  const blob = new Blob([data], { type: 'text/csv' });

  // Creating an object for downloading url
  const url = window.URL.createObjectURL(blob)

  // Creating an anchor(a) tag of HTML
  const a = document.createElement('a')

  // Passing the blob downloading url
  a.setAttribute('href', url)

  // Setting the anchor tag attribute for downloading
  // and passing the download file name which will be the date range.
  a.setAttribute('download', filename);

  // Performing a download with click, simulates clicking essentially.
  a.click()
}

// for array of objects
export function csvMaker(data) {
  // Empty array for storing the values
  let csvRows = [];

  // Headers is basically a keys of an
  // object which will be based on first element
  const headers = Object.keys(data[0]);

  // As for making csv format, headers
  // must be separated by comma and
  // pushing it into array
  csvRows.push(headers.join(','));

  // Push each object values into the array
  data.forEach(measurement => {
    measurement['timestamp'] = `"${measurement['timestamp']}"`;
    const values = Object.values(measurement).join(',');
    csvRows.push(values);
  });

  // get first and last date to create name of file
  
  let csvData = csvRows.join('\n');
  const fileName = `${extractDate(data[0]['timestamp'])} - ${extractDate(data[data.length - 1]['timestamp'])}`;

  return {csv_data: csvData, file_name: fileName};
}

function extractDate(date) {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${day} ${month}, ${year}`;
}