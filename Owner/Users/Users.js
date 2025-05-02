document.addEventListener("DOMContentLoaded", () => {
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modal = document.getElementById("registerModal");
  const submitBtn = document.querySelector(".submit");
<<<<<<< HEAD
  const userTable = document.querySelector(".user-table tbody");

  let editingRow = null; 

  function loadData() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.forEach((user) => {
      const newRow = createTableRow(user);
      userTable.appendChild(newRow);
      attachRowActions(newRow);
    });
  }

  function saveData() {
    const users = [];
    userTable.querySelectorAll("tr").forEach((row) => {
      const user = {
        //userId: row.cells[0].textContent,
        position: row.cells[1].textContent,
        username: row.cells[2].textContent,
        name: row.cells[3].textContent,
        status: row.cells[4].textContent,
        password: row.dataset.password, 
      };
      users.push(user);
    });
    localStorage.setItem("users", JSON.stringify(users));
=======

  const searchBar = document.getElementById("searchbar");
  const roleFilter = document.getElementById("roleFilter");
  const statusFilter = document.getElementById("statusFilter");

  // Auto-incrementing user ID (this will need backend validation in real projects)
  function generateUserId() {
    return Math.floor(10000 + Math.random() * 90000); // Random 5-digit ID
>>>>>>> newUI
  }

  openModalBtn.addEventListener("click", () => {
    modal.classList.add("active");
    clearForm();
<<<<<<< HEAD
    editingRow = null; 
=======
    document.querySelector("input[placeholder='User id']").value = "Auto-generated";
>>>>>>> newUI
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

<<<<<<< HEAD
  // submitBtn.addEventListener("click", (e) => { //this prevents the database to connect.
  //   e.preventDefault(); 

  //   //const userId = document.querySelector("input[placeholder='Enter user id']").value;
  //   const positionId = document.getElementById("position").value;
  //   const username = document.querySelector("input[placeholder='Enter username']").value;
  //   const password = document.querySelector("input[placeholder='Enter new password']").value;
  //   const name = document.querySelector("input[placeholder='Enter name']").value;
  //   const status = document.getElementById("status").value;

  //   if (positionId && username && password && name) {//removed userID on conditions
  //     if (editingRow) {
  //       editingRow.cells[0].textContent = userId;
  //       editingRow.cells[1].textContent = positionId;
  //       editingRow.cells[2].textContent = username;
  //       editingRow.cells[3].textContent = name;
  //       editingRow.cells[4].textContent = status;
  //       editingRow.dataset.password = password; 
  //     } else {
  //       const newRow = createTableRow({position: positionId, username, name, status, password }); //removed UserID
  //       userTable.appendChild(newRow);
  //       attachRowActions(newRow);
  //     }
  //     saveData(); 
  //     modal.classList.remove("active"); 
  //     clearForm();
  //   } else {
  //     alert("Please fill in all fields.");
  //   }
  // });

  function createTableRow({ userId, position, username, name, status, password }) {
    const newRow = document.createElement("tr");
    newRow.dataset.password = password; 
    newRow.innerHTML = `
      <td>${userId}</td>
      <td>${position}</td>
      <td>${username}</td>
      <td>${name}</td>
      <td>${status}</td>
      <td>
        <button class="action-btn edit-btn">
          <span class="material-icons-sharp">edit</span>
        </button>
        <button class="action-btn delete-btn">
          <span class="material-icons-sharp">delete</span>
        </button>
      </td>
    `;
    return newRow;
  }

  function attachRowActions(row) {
    const editBtn = row.querySelector(".edit-btn");
    const deleteBtn = row.querySelector(".delete-btn");

    editBtn.addEventListener("click", () => {
      editingRow = row;
      const cells = row.cells;
      //document.querySelector("input[placeholder='Enter user id']").value = cells[0].textContent;
      document.getElementById("position").value = cells[1].textContent;
      document.querySelector("input[placeholder='Enter username']").value = cells[2].textContent;
      document.querySelector("input[placeholder='Enter new password']").value = row.dataset.password; // Use the stored password
      document.querySelector("input[placeholder='Enter name']").value = cells[3].textContent;
      document.getElementById("status").value = cells[4].textContent;

      modal.classList.add("active");
    });

    deleteBtn.addEventListener("click", () => {
      const confirmDelete = confirm("Are you sure you want to delete this user?");
      if (confirmDelete) {
        row.remove();
        saveData(); 
      }
    });
  }

  function clearForm() {
    //document.querySelector("input[placeholder='Enter user id']").value = "";
=======
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
>>>>>>> newUI
    document.getElementById("position").value = "Admin";
    document.querySelector("input[placeholder='Enter username']").value = "";
    document.querySelector("input[placeholder='Enter new password']").value = "";
    document.querySelector("input[placeholder='Enter name']").value = "";
    document.getElementById("status").value = "Active";
  }

<<<<<<< HEAD
  loadData();
=======
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
>>>>>>> newUI
});
