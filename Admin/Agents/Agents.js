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

  let editingRow = null;

  function getNextAgentId() {
    let lastId = parseInt(localStorage.getItem("lastAgentId") || "10001");
    return lastId.toString(); // Do not increment here
  }

  openModalBtn.addEventListener("click", () => {
    modal.classList.add("active");
    clearForm();
    editingRow = null;
    const nextId = getNextAgentId();
    agentIdInput.value = nextId;
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

  function addAgentToTable(agent) {
    const row = document.createElement("tr");
    const statusText =
      agent.status == "1" || agent.status === "Active" ? "Active" : "Inactive";
    row.dataset.password = agent.commission;
    row.innerHTML = `
      <td>${agent.id}</td>
      <td>${agent.name}</td>
      <td>${agent.age}</td>
      <td>${agent.commission}</td>
      <td>${agent.area}</td>
      <td>${statusText}</td>
      <td>
        <button class="action-btn edit-btn">
          <span class="material-icons-sharp">edit</span>
        </button>
        <button class="action-btn delete-btn">
          <span class="material-icons-sharp">delete</span>
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
      editingRow = row;
      const cells = row.cells;
      agentIdInput.value = cells[0].textContent;
      document.querySelector("input[placeholder='Enter agent name']").value =
        cells[1].textContent;
      document.querySelector("input[placeholder='Enter age']").value =
        cells[2].textContent;
      document.querySelector(
        "input[placeholder='Enter commission percent']"
      ).value = cells[3].textContent;
      document.getElementById("area").value = cells[4].textContent;
      document.getElementById("status").value = cells[5].textContent;

      modal.classList.add("active");
    });

    deleteBtn.addEventListener("click", () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete this user?"
      );
      if (confirmDelete) {
        const agentId = row.cells[0].textContent;
        row.remove();
        const agents = getAgentsFromStorage().filter((a) => a.id !== agentId);
        saveAgentsToStorage(agents);
        filterTable();
      }
    });
  }

  function clearForm() {
    agentIdInput.value = "";
    document.querySelector("input[placeholder='Enter agent name']").value = "";
    document.querySelector("input[placeholder='Enter age']").value = "";
    document.querySelector(
      "input[placeholder='Enter commission percent']"
    ).value = "";
    document.getElementById("area").value = "Davao-South";
    document.getElementById("status").value = "Active";
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
    formData.append("register", true);

    fetch("../../registeragent.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.text())
      .then((responseText) => {
        alert("Agent successfully registered.");
        form.reset();
        modal.classList.remove("active"); // hide modal
        loadAgents(); // ✅ refresh table
      })
      .catch((error) => console.error("Error:", error));
  });

  loadAgents(); // ✅ Initial load of agents
});

// Global loadAgents function
function loadAgents() {
  fetch("../../getagents.php")
    .then((res) => res.json())
    .then((agents) => {
      const tbody = document.querySelector(".user-table tbody");
      tbody.innerHTML = "";

      agents.forEach((agent) => {
        try {
          const row = document.createElement("tr");
          const statusText = agent.status == "1" ? "Active" : "Inactive";

          row.innerHTML = `
            <td>${agent.id}</td>
            <td>${agent.name}</td>
            <td>${agent.age}</td>
            <td>${agent.commission}</td>
            <td>${agent.area}</td>
            <td>${statusText}</td>
            <td>
              <button class="action-btn edit-btn"><span class="material-icons-sharp">edit</span></button>
              <button class="action-btn delete-btn"><span class="material-icons-sharp">delete</span></button>
            </td>
          `;
          tbody.appendChild(row);
          attachRowActions(row); // This might be the error source
        } catch (err) {
          console.error("Error rendering agent row:", err);
        }
      });
    })
    .catch((err) => console.error("Failed to load agents:", err));
}

// Dummy helpers (you can remove these if no longer needed)
function getAgentsFromStorage() {
  return JSON.parse(localStorage.getItem("agents") || "[]");
}
function saveAgentsToStorage(agents) {
  localStorage.setItem("agents", JSON.stringify(agents));
}
