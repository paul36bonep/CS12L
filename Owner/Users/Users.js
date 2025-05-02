document.addEventListener("DOMContentLoaded", () => {
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modal = document.getElementById("registerModal");
  const submitBtn = document.querySelector(".submit");

  const searchBar = document.getElementById("searchbar");
  const roleFilter = document.getElementById("roleFilter");
  const statusFilter = document.getElementById("statusFilter");

  // Auto-incrementing user ID (this will need backend validation in real projects)
  function generateUserId() {
    return Math.floor(10000 + Math.random() * 90000); // Random 5-digit ID
  }

  openModalBtn.addEventListener("click", () => {
    modal.classList.add("active");
    clearForm();
    document.querySelector("input[placeholder='User id']").value = "Auto-generated";
  });

  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    clearForm();
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
  
    const userId = document.querySelector("input[placeholder='User id']").value;
    const positionId = document.getElementById("position").value;
    const username = document.querySelector("input[placeholder='Enter username']").value;
    const password = document.querySelector("input[placeholder='Enter new password']").value;
    const name = document.querySelector("input[placeholder='Enter name']").value;
    const status = document.getElementById("status").value;
  
    if (userId && positionId && username && password && name) {
      const formData = new FormData();
      formData.append("position", positionId);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("name", name);
      formData.append("status", status);
  
      fetch("users.php", {
        method: "POST",
        body: formData
      })
      .then(res => res.text())
      .then(data => {
        alert(data);
        modal.classList.remove("active");
        clearForm();
        // Optional: refresh page or re-fetch users from DB if you implement a display
      })
      .catch(error => {
        console.error("Error:", error);
      });
    } else {
      alert("Please fill in all fields.");
    }
  });  

 
  function clearForm() {
    document.querySelector("input[placeholder='User id']").value = "";
    document.getElementById("position").value = "Admin";
    document.querySelector("input[placeholder='Enter username']").value = "";
    document.querySelector("input[placeholder='Enter new password']").value = "";
    document.querySelector("input[placeholder='Enter name']").value = "";
    document.getElementById("status").value = "Active";
  }

  searchBar.addEventListener("input", filterTable);
  roleFilter.addEventListener("change", filterTable);
  statusFilter.addEventListener("change", filterTable);

  function filterTable() {
    const query = searchBar.value.toLowerCase();
    const selectedRole = roleFilter.value;
    const selectedStatus = statusFilter.value;

    document.querySelectorAll(".user-table tbody tr").forEach((row) => {
      const role = row.cells[1]?.textContent;
      const username = row.cells[2]?.textContent.toLowerCase();
      const name = row.cells[3]?.textContent.toLowerCase();
      const status = row.cells[4]?.textContent;

      const matchesSearch = username.includes(query) || name.includes(query);
      const matchesRole = selectedRole === "All" || role === selectedRole;
      const matchesStatus = selectedStatus === "All" || status === selectedStatus;

      row.style.display = matchesSearch && matchesRole && matchesStatus ? "" : "none";
    });
  } 
});
