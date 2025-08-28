window.onload = function () {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    window.location.href = "login.html";
    return;
  }


  const baseURL = window.location.origin; // e.g., https://kingsmenpastries.com
  const referralCode = `${user.name.split(" ")[0].toLowerCase()}${user.email.split("@")[0].slice(-4)}`;
  const referralLink = `${baseURL}/signup.html?ref=${referralCode}`;

  // Display referral link
  document.getElementById("referral-link").value = referralLink;

  // Store it for later if needed
  localStorage.setItem("referralCode", referralCode);
  localStorage.setItem("referralLink", referralLink);

  // Copy to clipboard
  document.getElementById("copy-referral").addEventListener("click", () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied to clipboard!");
  });


  document.getElementById("user-name").textContent = user.name || "Unknown";
  document.getElementById("user-email").textContent = user.email || "Unknown";
  document.getElementById("profile-pic").src = user.image || "default.png";
  document.getElementById("user-phone").value = user.phone || "";
  document.getElementById("user-address").value = user.address || "";
};

// Save changes to localStorage
document.getElementById("save-info").addEventListener("click", () => {
  const phone = document.getElementById("user-phone").value;
  const address = document.getElementById("user-address").value;

  const user = JSON.parse(localStorage.getItem('user')) || {};
  user.phone = phone;
  user.address = address;

  localStorage.setItem('user', JSON.stringify(user));

  alert("Your info has been updated!");
});

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});
