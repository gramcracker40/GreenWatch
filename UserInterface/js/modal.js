// Open Modal when button clicked
const modalTrigger = document.querySelector('.modal-trigger');
const modalCreate = document.querySelector('.modal-create');
const modal = document.querySelector('.modal');

modalTrigger.addEventListener('click', function() {
  modal.style.display = "block";
});

modalCreate.addEventListener('click', function() {
  const roomName = document.getElementById("roomnameTextbox").value;

  console.log(roomName);

  const room = {
    "name": roomName,
    "greenhouse_id": 1
  }

  // Make api post request with room name.
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(room)
  }

  createRoom(options);
});

// Close Modal when close button clicked
const closeButton = document.querySelector('.close-button');

closeButton.addEventListener('click', function() {
  modal.style.display = "none";
});

// Close Modal when user clicks anywhere outside of the modal
window.addEventListener('click', function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

function createRoom(options) {
  fetch('http://192.168.1.115:5000/rooms', options)
  .then((res) => {
    if (res.ok) {
      setTimeout(function() {
        window.location.href = 'roompage.html';
      }, 3000);
    }else{
      console.log(res.body);
    }
  })
}