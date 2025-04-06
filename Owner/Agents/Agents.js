document.addEventListener("DOMContentLoaded", () => {
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modal = document.getElementById("registerModal");
  const submitBtn = document.querySelector(".submit");
  const userTable = document.querySelector(".user-table tbody");

  let editingRow = null; 

  openModalBtn.addEventListener("click", () => {
    modal.classList.add("active");
    clearForm();
    editingRow = null; 
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

    const userId = document.querySelector("input[placeholder='Enter agent id']").value;
    const positionId = document.querySelector("input[placeholder='Enter agent name']").value;
    const username = document.querySelector("input[placeholder='Enter age']").value;
    const password = document.querySelector("input[placeholder='Enter commission percent']").value;
    const name = document.querySelector("input[placeholder='Enter area']").value;
    const status = document.getElementById("status").value;

    if (userId && positionId && username && password && name) {
      if (editingRow) {
        editingRow.cells[0].textContent = userId;
        editingRow.cells[1].textContent = positionId;
        editingRow.cells[2].textContent = username;
        editingRow.cells[3].textContent = password;
        editingRow.cells[4].textContent = name;
        editingRow.cells[5].textContent = status;
        editingRow.dataset.password = password;
      } else {

        const newRow = document.createElement("tr");
        newRow.dataset.password = password; 
        newRow.innerHTML = `
          <td>${userId}</td>
          <td>${positionId}</td>
          <td>${username}</td>
          <td>${password}</td>
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
        userTable.appendChild(newRow);
        attachRowActions(newRow);
      }

      modal.classList.remove("active"); 
      clearForm();
    } else {
      alert("Please fill in all fields.");
    }
  });

  function attachRowActions(row) {
    const editBtn = row.querySelector(".edit-btn");
    const deleteBtn = row.querySelector(".delete-btn");

    editBtn.addEventListener("click", () => {
      editingRow = row;
      const cells = row.cells;
      document.querySelector("input[placeholder='Enter agent id']").value = cells[0].textContent;
      document.querySelector("input[placeholder='Enter agent name']").value = cells[1].textContent;
      document.querySelector("input[placeholder='Enter age']").value = cells[2].textContent;
      document.querySelector("input[placeholder='Enter commission percent']").value = cells[3].textContent;
      document.querySelector("input[placeholder='Enter area']").value = cells[4].textContent;
      document.getElementById("status").value = cells[5].textContent;

      modal.classList.add("active");
    });

    deleteBtn.addEventListener("click", () => {
      const confirmDelete = confirm("Are you sure you want to delete this user?");
      if (confirmDelete) {
        row.remove();
      }
    });
  }

  function clearForm() {
    document.querySelector("input[placeholder='Enter agent id']").value = "";
    document.querySelector("input[placeholder='Enter agent name']").value = "";
    document.querySelector("input[placeholder='Enter age']").value = "";
    document.querySelector("input[placeholder='Enter commission percent']").value = "";
    document.querySelector("input[placeholder='Enter area']").value = "";
    document.getElementById("status").value = "Active";
  }

  document.querySelectorAll(".user-table tbody tr").forEach((row) => {
    attachRowActions(row);
  });
});
