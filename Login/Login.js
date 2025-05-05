document.getElementById("loginButton").addEventListener("click", function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("login.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Redirect based on role
        switch (data.role) {
          case "Owner":
            window.location.href = "../Owner/dashboard.php";
            break;
          case "Admin":
            window.location.href = "../Admin/dashboard.php";
            break;
          case "Unit Manager":
            window.location.href = "../Unit_Manager/dashboard.php";
            break;
          default:
            alert("Unknown role");
        }
      } else {
        alert("Login failed: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred during login.");
    });
  if (!username || !password) {
    alert("Please fill in both username and password.");
    return;
  }
  function togglePassword() {
    const passwordInput = document.getElementById("password");
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  }
});
