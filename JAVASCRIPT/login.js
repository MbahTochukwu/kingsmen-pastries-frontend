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
      const response = await fetch("https://kingsmen-pastries-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        loginMessage.innerText = "Login successful!";
        loginMessage.style.color = "green";
        // Ensure user object has _id or id
        const user = {
          id: data.user.id || data.user._id, // Use _id if id is not present
          name: data.user.name,
          email: data.user.email,
          profilePic: data.user.profilePic
        };
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(user));

       // Notify on login
        await fetch('https://kingsmen-pastries-backend.onrender.com/api/notify-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.name || 'Unknown',
          }),
        }).catch(err => console.error('Login notification failed:', err));

        const redirect = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
        setTimeout(() => {
          window.location.href = redirect;
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
});

function handleGoogleCredentialResponse(response) {
  const idToken = response.credential;
  console.log("Google idToken:", idToken);
  fetch("https://kingsmen-pastries-backend.onrender.com/api/auth/google-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: idToken })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const user = {
          id: data.user.id || data.user._id, // Ensure _id is used if id is missing
          name: data.user.name,
          email: data.user.email,
          profilePic: data.user.profilePic,
          token: data.token
        };
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("token", data.token);

       // Notify on Google login
        fetch('https://kingsmen-pastries-backend.onrender.com/api/notify-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.name || 'Unknown',
          }),
        }).catch(err => console.error('Google login notification failed:', err));



        alert('Logged in successfully!');
        const redirect = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
        window.location.href = redirect;
      } else {
        alert('Login failed: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error during Google login:', error);
      alert('Login error: ' + error.message);
    });
}