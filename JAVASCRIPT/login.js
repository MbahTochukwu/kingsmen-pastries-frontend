document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginMessage = document.getElementById("login-message");
  
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault(); 
  
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
  
      if (!email || !password) {
        loginMessage.textContent = "Please enter both email and password.";
        loginMessage.style.color = "red";
        return;
      }
  
     
      if (email === "user@example.com" && password === "password123") {
        loginMessage.textContent = "Login successful!";
        loginMessage.style.color = "green";
  
        
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1500);
      } else {
        loginMessage.textContent = "Invalid email or password.";
        loginMessage.style.color = "red";
      }
    });
  });
  

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("https://kingsmen-pastries-backend.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("loginMessage").innerText = "Login successful!";
     
      localStorage.setItem("user", JSON.stringify(data));
     
    } else {
      document.getElementById("loginMessage").innerText = data.message || "Login failed.";
    }

  } catch (err) {
    console.error(err);
    document.getElementById("loginMessage").innerText = "An error occurred.";
  }
});
