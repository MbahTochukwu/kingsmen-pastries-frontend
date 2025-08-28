// document.getElementById("signup-form").addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const fullname = document.getElementById("fullname").value.trim();
//   const email = document.getElementById("signup-email").value.trim();
//   const password = document.getElementById("signup-password").value.trim();
//   const confirmPassword = document.getElementById("confirm-password").value.trim();
//   const message = document.getElementById("signup-message");
//   const urlParams = new URLSearchParams(window.location.search);
//   const referrerCode = urlParams.get('ref');

 
//   message.textContent = "";
//   message.style.color = "red";

//   if (referrerCode) {
//   localStorage.setItem("referrerCode", referrerCode);
// }

//   if (!email.includes("@")) {
//     message.textContent = "Please enter a valid email address.";
//     return;
//   }

//   if (password.length < 6) {
//     message.textContent = "Password must be at least 6 characters.";
//     return;
//   }

//   if (password !== confirmPassword) {
//     message.textContent = "Passwords do not match.";
//     return;
//   }

//   try {
//     const response = await fetch("http://localhost:3000/api/auth/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name: fullname, email, password })
//     });

//     const data = await response.json();

//     if (response.ok) {
//       message.style.color = "green";
//       message.textContent = "Signup successful! Redirecting to login...";
//       setTimeout(() => {
//         window.location.href = "login.html";
//       }, 2000);
//     } else {
//       message.textContent = data.message || "Signup failed.";
//     }

//   } catch (err) {
//     console.error(err);
//     message.textContent = "An error occurred.";
//   }
// });
// const formData = {
//   name: document.getElementById("name").value,
//   email: document.getElementById("email").value,
//   password: document.getElementById("password").value,
//   referredBy: localStorage.getItem("referrerCode") || null,
// };

// fetch("/api/signup", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify(formData),
// })
// .then(res => res.json())
// .then(data => {
//   alert("Signup successful!");
//   // Redirect or store token, etc.
// });
// document.getElementById('signup-form').addEventListener('submit', (e) => {
//   const storedRefCode = localStorage.getItem('referralCodeUsed');
//   document.getElementById('referralCode').value = storedRefCode || '';
// });



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
    const response = await fetch("http://localhost:3000/api/auth/signup", {
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