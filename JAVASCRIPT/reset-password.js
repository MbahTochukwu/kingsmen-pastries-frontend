document.getElementById("reset-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const emailInput = document.getElementById("reset-email");
  const messageDiv = document.getElementById("reset-message");
  const email = emailInput.value.trim();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValidEmail) {
    messageDiv.style.color = "red";
    messageDiv.textContent = "Please enter a valid email address.";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (response.ok) {
      messageDiv.style.color = "green";
      messageDiv.textContent = "A password reset link has been sent to your email.";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 3000);
    } else {
      messageDiv.style.color = "red";
      messageDiv.textContent = data.message || "Error sending reset link.";
    }
  } catch (error) {
    console.error(error);
    messageDiv.style.color = "red";
    messageDiv.textContent = "An unexpected error occurred.";
  }
});
