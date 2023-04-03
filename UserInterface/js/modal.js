// Open Modal when button clicked
const modalTrigger = document.querySelector('.modal-trigger');
const modal = document.querySelector('.modal');

modalTrigger.addEventListener('click', function() {
  modal.style.display = "block";
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
