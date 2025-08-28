document.addEventListener("DOMContentLoaded", () => {
  const forgotForm = document.getElementById("forgotForm");
  const message = document.getElementById("message");

  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;

    try {
      const res = await fetch("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        message.textContent = data.message;
        message.style.color = "green";
      } else {
        message.textContent = data.message || "Failed to send reset link";
        message.style.color = "red";
      }
    } catch (err) {
      console.error(err);
      message.textContent = "Error. Try again.";
      message.style.color = "red";
    }
  });
  
});
