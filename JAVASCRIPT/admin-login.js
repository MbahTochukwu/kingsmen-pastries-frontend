document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('admin-login-form');
  const passwordInput = document.getElementById('password');
  const errorMessage = document.getElementById('error-message');

  const ADMIN_PASSWORD = "kingsmen123"; 

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (passwordInput.value === ADMIN_PASSWORD) {
      
      localStorage.setItem("isAdminLoggedIn", "true");
      window.location.href = "admin.html"; 
    } else {
      errorMessage.textContent = "Invalid password. Please try again.";
    }
  });
});
