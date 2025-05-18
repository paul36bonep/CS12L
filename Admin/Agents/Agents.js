document.addEventListener("DOMContentLoaded", () => {
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modal = document.getElementById("registerModal");
  const submitBtn = document.querySelector(".submit");
  const userTable = document.querySelector(".user-table tbody");

  const searchBar = document.getElementById("searchbar");
  const areaFilter = document.getElementById("areaFilter");
  const statusFilter = document.getElementById("statusFilter");

  const agentIdInput = document.getElementById("agentIdInput");
  const agentNameInput = document.getElementById("agentNameInput");
  const agentAgeInput = document.getElementById("agentAgeInput");
  const commissionInput = document.getElementById("commissionInput");
  const areaInput = document.getElementById("area");
  const statusInput = document.getElementById("status");

  let editingRow = null;
  let isEditing = false;
  let editingAgentId = null;

  function getNextAgentId() {
    let lastId = parseInt(localStorage.getItem("lastAgentId") || "10001");
    return lastId.toString();
  }

  openModalBtn.addEventListener("click", () => {
    modal.classList.add("active");
    clearForm();
    editingRow = null;
    agentIdInput.value = getNextAgentId();
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

  function clearForm() {
    agentIdInput.value = "";
    agentNameInput.value = "";
    agentAgeInput.value = "";
    commissionInput.value = "";
    areaInput.value = "Davao-South";
    statusInput.value = "Active";
    isEditing = false;
    editingAgentId = null;
  }

  function filterTable() {
    const query = searchBar.value.toLowerCase();
    const selectedArea = areaFilter.value;
    const selectedStatus = statusFilter.value;

    userTable.querySelectorAll("tr").forEach((row) => {
      const agentId = row.cells[0].textContent.toLowerCase();
      const name = row.cells[1].textContent.toLowerCase();
      const area = row.cells[4].textContent;
      const status = row.cells[5].textContent;

      const matchesSearch = agentId.includes(query) || name.includes(query);
      const matchesArea = selectedArea === "All" || area === selectedArea;
      const matchesStatus =
        selectedStatus === "All" || status === selectedStatus;

      row.style.display =
        matchesSearch && matchesArea && matchesStatus ? "" : "none";
    });
  }

  searchBar.addEventListener("input", filterTable);
  areaFilter.addEventListener("change", filterTable);
  statusFilter.addEventListener("change", filterTable);

  const form = document.getElementById("agentForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    if (isEditing) {
      // If we're editing, send to update script
      formData.append("update", true);

      fetch("updateagent.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.text())
        .then((responseText) => {
          alert("Agent successfully updated.");
          form.reset();
          modal.classList.remove("active");
          isEditing = false;
          editingAgentId = null;
          loadAgents();
        })
        .catch((error) => console.error("Update error:", error));
    } else {
      // Else we're adding a new agent
      formData.append("register", true);

      fetch("../../registeragent.php", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.text())
        .then((responseText) => {
          alert("Agent successfully registered.");
          form.reset();
          modal.classList.remove("active");
          loadAgents();
        })
        .catch((error) => console.error("Register error:", error));
    }
  });

  function addAgentToTable(agent) {
    const row = document.createElement("tr");
    const statusText =
      agent.status == "1" || agent.status === "Active" ? "Active" : "Inactive";
    const statusClass =
      statusText === "Active" ? "status-active" : "status-inactive";
    row.innerHTML = `
      <td>${agent.id}</td>
      <td>${agent.name}</td>
      <td>${agent.age}</td>
      <td>${agent.commission}%</td>
      <td>${agent.area}</td>
      <td class="${statusClass}">${statusText}</td>
      <td>
        <button class="action-btn edit-btn">
      <span class="material-icons-sharp">edit</span>
      <span class="btn-label edit-label">Edit</span>
    </button>
        <button class="action-btn delete-btn">
      <span class="material-icons-sharp">delete</span>
      <span class="btn-label delete-label">Delete</span>
    </button>
      </td>
    `;

    userTable.appendChild(row);

    attachRowActions(row);
  }

  function attachRowActions(row) {
    const editBtn = row.querySelector(".edit-btn");
    const deleteBtn = row.querySelector(".delete-btn");

    editBtn.addEventListener("click", () => {
      const cells = row.cells;

      agentIdInput.value = cells[0].textContent;
      agentNameInput.value = cells[1].textContent;
      agentAgeInput.value = cells[2].textContent;
      commissionInput.value = cells[3].textContent.replace("%", "");
      areaInput.value = cells[4].textContent;
      statusInput.value = cells[5].textContent;

      isEditing = true;
      editingAgentId = cells[0].textContent;

      modal.classList.add("active");
    });

    deleteBtn.addEventListener("click", () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete this user?"
      );
      if (confirmDelete) {
        const agentId = row.cells[0].textContent;
        fetch("deleteagent.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `id=${encodeURIComponent(agentId)}`,
        })
          .then((res) => res.text())
          .then((response) => {
            console.log("Server delete response:", response);
            row.remove();
          })
          .catch((error) =>
            console.error("Error deleting from server:", error)
          );
      }
    });
  }

  function loadAgents() {
    fetch("../../getagents.php")
      .then((res) => res.json())
      .then((agents) => {
        userTable.innerHTML = "";
        agents.forEach((agent) => {
          addAgentToTable(agent);
        });
      })
      .catch((err) => console.error("Failed to load agents:", err));
  }

  loadAgents(); // Initial load
});

// Global loadAgents function

// Dummy helpers (you can remove these if no longer needed)
function getAgentsFromStorage() {
  return JSON.parse(localStorage.getItem("agents") || "[]");
}
function saveAgentsToStorage(agents) {
  localStorage.setItem("agents", JSON.stringify(agents));
}
