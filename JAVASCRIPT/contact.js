document.getElementById("contactForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const contactMessage = document.getElementById("contactMessage");

  contactMessage.textContent = "Sending...";

  try {
    const response = await fetch("https://kingsmen-pastries-backend.onrender.com/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message })
    });

    const data = await response.json();

    if (response.ok) {
      contactMessage.style.color = "green";
      contactMessage.textContent = data.message;
      // Optionally clear form
      document.getElementById("contactForm").reset();
    } else {
      contactMessage.style.color = "red";
      contactMessage.textContent = data.message || "Failed to send.";
    }

  } catch (err) {
    console.error(err);
    contactMessage.style.color = "red";
    contactMessage.textContent = "An error occurred. Try again.";
  }
});
