document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginMessage = document.getElementById("login-message");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      loginMessage.innerText = "Please enter both email and password.";
      loginMessage.style.color = "red";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        loginMessage.innerText = "Login successful!";
        loginMessage.style.color = "green";

        // Store the token
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      } else {
        loginMessage.innerText = data.message || "Login failed.";
        loginMessage.style.color = "red";
      }
    } catch (err) {
      console.error(err);
      loginMessage.innerText = "An error occurred.";
      loginMessage.style.color = "red";
    }
  });
})

function handleGoogleCredentialResponse(response) {
  const idToken = response.credential;
  console.log("Google idToken:", idToken);
  fetch("http://localhost:3000/api/auth/google-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token: idToken })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("user", JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          profilePic: data.user.profilePic,
          token: data.token // Expect token from backend
        }));
        localStorage.setItem("token", data.token);
        alert('Logged in successfully!');
        window.location.href = 'index.html';
      } else {
        alert('Login failed: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error during Google login:', error);
      alert('Login error: ' + error.message);
    });
}