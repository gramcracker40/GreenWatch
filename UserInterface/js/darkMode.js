// Function to initialize dark mode toggle logic
export function initializeDarkModeToggle() {
    // Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
    const darkModeSwitch = document.getElementById('darkModeSwitch');
  
    // Check if the user has a preference stored in localStorage
    const isDarkMode = localStorage.getItem('darkMode') === "true";
  
    // Apply the stored preference
    darkModeSwitch.checked = isDarkMode;
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  
    // Listen for changes to the toggle switch
    darkModeSwitch.addEventListener('change', () => {
      if (darkModeSwitch.checked) {
        // Activate dark mode and store the preference
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', "true");
      } else {
        // Deactivate dark mode and store the preference
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', "false");
      }
    });
  });
  
  }
  
//   // Applies user's preference on page load hopefully 
//   export function applyDarkModePreference() {
//     const darkModePreference = localStorage.getItem('darkMode');
//     if (darkModePreference === 'enabled') {
//       document.body.classList.add('dark-mode');
//     } else {
//       document.body.classList.remove('dark-mode');
//     }
//   }
  