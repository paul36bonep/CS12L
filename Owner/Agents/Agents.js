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

  getAgentsFromStorage().forEach(agent => {
    addAgentToTable(agent);
  });

  function getNextAgentId() {
    let lastId = parseInt(localStorage.getItem("lastAgentId") || "10001");
    return lastId.toString(); // Just return current, don't increment here
  }

  function getAgentsFromStorage() {
    return JSON.parse(localStorage.getItem("agents")) || [];
  }

  function saveAgentsToStorage(agents) {
    localStorage.setItem("agents", JSON.stringify(agents));
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

  // submitBtn.addEventListener("click", (e) => {
  //   e.preventDefault();

  //   const userId = agentIdInput.value;
  //   const positionId = document.querySelector("input[placeholder='Enter agent name']").value;
  //   const username = document.querySelector("input[placeholder='Enter age']").value;
  //   const password = document.querySelector("input[placeholder='Enter commission percent']").value;
  //   const name = document.getElementById("area").value;
  //   const status = document.getElementById("status").value;

  //   if (userId && positionId && username && password && name) {
  //     if (editingRow) {
  //       const updatedAgent = {
  //         id: userId,
  //         name: positionId,
  //         age: username,
  //         commission: password,
  //         area: name,
  //         status: status
  //       };

  //       editingRow.cells[0].textContent = userId;
  //       editingRow.cells[1].textContent = positionId;
  //       editingRow.cells[2].textContent = username;
  //       editingRow.cells[3].textContent = password;
  //       editingRow.cells[4].textContent = name;
  //       editingRow.cells[5].textContent = status;
  //       editingRow.dataset.password = password;

  //       const agents = getAgentsFromStorage();
  //       const index = agents.findIndex(a => a.id === userId);
  //       if (index !== -1) {
  //         agents[index] = updatedAgent;
  //         saveAgentsToStorage(agents);
  //       }

  //       alert("Agent successfully updated!");
  //     } else {
  //       const agents = getAgentsFromStorage();
  //       const newAgent = {
  //         id: userId,
  //         name: positionId,
  //         age: username,
  //         commission: password,
  //         area: name,
  //         status: status
  //       };

  //       agents.push(newAgent);
  //       saveAgentsToStorage(agents);
  //       addAgentToTable(newAgent);

  //       // ✅ Increment lastAgentId only after successful addition
  //       let lastId = parseInt(localStorage.getItem("lastAgentId") || "10001");
  //       localStorage.setItem("lastAgentId", lastId + 1);

  //       alert("Agent successfully added!");
  //     }

  //     modal.classList.remove("active");
  //     clearForm();
  //     filterTable();
  //   } else {
  //     alert("Please fill in all fields.");
  //   }
  // });

  function addAgentToTable(agent) {
    const row = document.createElement("tr");
    row.dataset.password = agent.commission;
    row.innerHTML = `
      <td>${agent.id}</td>
      <td>${agent.name}</td>
      <td>${agent.age}</td>
      <td>${agent.commission}</td>
      <td>${agent.area}</td>
      <td>${agent.status}</td>
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
      document.querySelector("input[placeholder='Enter agent name']").value = cells[1].textContent;
      document.querySelector("input[placeholder='Enter age']").value = cells[2].textContent;
      document.querySelector("input[placeholder='Enter commission percent']").value = cells[3].textContent;
      document.getElementById("area").value = cells[4].textContent;
      document.getElementById("status").value = cells[5].textContent;

      modal.classList.add("active");
    });

    deleteBtn.addEventListener("click", () => {
      const confirmDelete = confirm("Are you sure you want to delete this user?");
      if (confirmDelete) {
        const agentId = row.cells[0].textContent;
        row.remove();
        const agents = getAgentsFromStorage().filter(a => a.id !== agentId);
        saveAgentsToStorage(agents);
        filterTable();
      }
    });
  }

  function clearForm() {
    agentIdInput.value = "";
    document.querySelector("input[placeholder='Enter agent name']").value = "";
    document.querySelector("input[placeholder='Enter age']").value = "";
    document.querySelector("input[placeholder='Enter commission percent']").value = "";
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
      const matchesStatus = selectedStatus === "All" || status === selectedStatus;

      row.style.display = matchesSearch && matchesArea && matchesStatus ? "" : "none";
    });
  }

  searchBar.addEventListener("input", filterTable);
  areaFilter.addEventListener("change", filterTable);
  statusFilter.addEventListener("change", filterTable);
});