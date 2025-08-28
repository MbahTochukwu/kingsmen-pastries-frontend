document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();
  const referralCode = document.getElementById("referralCode")?.value.trim() || localStorage.getItem("referrerCode") || null;
  const message = document.getElementById("signup-message");

  message.textContent = "";
  message.style.color = "red";

  if (!email.includes("@")) {
    message.textContent = "Please enter a valid email address.";
    return;
  }

  if (password.length < 6) {
    message.textContent = "Password must be at least 6 characters.";
    return;
  }

  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match.";
    return;
  }

  try {
    const response = await fetch("https://kingsmen-pastries-backend.onrender.com/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fullname,
        email,
        password,
        referredBy: referralCode
      })
    });

    const data = await response.json();

    if (response.ok) {
      message.style.color = "green";
      message.textContent = "Signup successful! Redirecting to login...";
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } else {
      message.textContent = data.message || "Signup failed.";
    }
  } catch (err) {
    console.error(err);
    message.textContent = "An error occurred.";
  }
});

// Optional: Set referral code input value from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  const storedRefCode = localStorage.getItem('referrerCode');
  if (storedRefCode && document.getElementById('referralCode')) {
    document.getElementById('referralCode').value = storedRefCode;
  }
});