document.addEventListener("DOMContentLoaded", () => {
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modal = document.getElementById("registerModal");
  const submitBtn = document.querySelector(".submit");
  const userTable = document.querySelector(".user-table tbody");
  const commissionLinesSection = document.getElementById(
    "embeddedCommissionLines"
  );
  const commissionLinesTable = document.getElementById(
    "commissionLinesTableBody"
  );
  const addLineBtn = document.getElementById("addLineBtn");
  const agentdropdown = document.getElementById("agentDropDown");
  const cardsdropdown = document.getElementById("cardsDropDown");
  const approvalStatusFilter = document.getElementById("approvalStatusFilter");
  let editingRow = null;
  let editingCommissionId = null;
  let tabledata = [];
  let subtotal = 0;
  let totalComm = 0;

  // Approval status filter
  approvalStatusFilter.addEventListener("change", filterCommissionsTable);

  function loadCommissions() {
    fetch("../../getcommissions.php")
      .then((res) => res.json())
      .then((commissions) => {
        userTable.innerHTML = ""; // Clear old rows
        commissions.forEach((c) => {
          const statusClass =
            {
              Pending: "status-pending",
              Approved: "status-approved",
              Rejected: "status-rejected",
              Canceled: "status-canceled",
            }[c.ApprovalStatus] || "";

          userTable.insertAdjacentHTML(
            "beforeend",
            `
          <tr>
            <td>${c.CommissionID}</td>
            <td>${c.AgentName || ""}</td>
            <td>${c.TotalCommission}</td>
            <td class="${statusClass}">${c.ApprovalStatus}</td>
            <td>
              <button class="action-btn edit-btn"${
                c.ApprovalStatus === "Approved" ||
                c.ApprovalStatus === "Canceled"
                  ? ' style="display:none;"'
                  : ""
              }>
                <span class="material-icons-sharp">edit</span>
                <span class="btn-label edit-label">Edit</span>
              </button>
              <button class="action-btn delete-btn">
                <span class="material-icons-sharp">delete</span>
                <span class="btn-label delete-label">Delete</span>
              </button>
            </td>
          </tr>
        `
          );
          const tr = userTable.lastElementChild;
          attachRowActions(tr);
        });
        filterCommissionsTable();
      });
  }

  // Set today's date
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const formattedDate = `${mm}/${dd}/${yyyy}`;
  document.getElementById("transactionDate").value = formattedDate;

  // Agent dropdown
  fetch("../../getagents.php")
    .then((response) => response.json())
    .then((agentnames) => {
      const activeAgents = agentnames.filter((agent) => agent.status === "1");
      updateAgentsDropdown(agentdropdown, activeAgents, "id", "name");
    })
    .catch((error) => {
      console.error("Error fetching Agent names:", error);
    });

  function updateAgentsDropdown(dropdown, items, value, text) {
    dropdown.innerHTML = `<option value="">Select Agent</option>`;
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item[value];
      option.textContent = item[text];
      dropdown.appendChild(option);
    });
  }

  agentdropdown.addEventListener("change", function () {
    const thisagentId = this.value;
    fetch("../../getagents.php")
      .then((response) => response.json())
      .then((agentnames) => {
        const agent = agentnames.find((agent) => agent.id == thisagentId);
        document.getElementById("commissionRate").value = agent
          ? agent.commission
          : "";
      })
      .catch((error) => {
        console.error("Error fetching Agent names:", error);
      });
  });

  // Cards dropdown
  fetch("../../getcards.php")
    .then((response) => response.json())
    .then((cards) => {
      updateCardsDropdown(
        cardsdropdown,
        cards,
        "cardId",
        "bankName",
        "cardType"
      );
    })
    .catch((error) => {
      console.error("Error fetching Cards information:", error);
    });

  function updateCardsDropdown(dropdown, items, value, bankName, cardType) {
    dropdown.innerHTML = `<option value="">Select Card</option>`;
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item[value];
      option.textContent = item[bankName] + "(" + item[cardType] + ")";
      dropdown.appendChild(option);
    });
  }

  cardsdropdown.addEventListener("change", function () {
    const thiscardId = this.value;
    fetch("../../getcards.php")
      .then((response) => response.json())
      .then((cards) => {
        const card = cards.find((card) => card.cardId == thiscardId);
        document.getElementById("cardAmount").value = card
          ? card.cardAmount
          : "";
      })
      .catch((error) => {
        console.error("Error fetching Cards Information:", error);
      });
  });

  // Calculate amount
  const quantity = document.getElementById("quantityInput");
  quantity.addEventListener("change", function () {
    const quantityval = this.value;
    const amount = document.getElementById("cardAmount").value;
    document.getElementById("totalInput").value =
      quantityval && amount ? quantityval * amount : "";
  });

  openModalBtn.addEventListener("click", () => {
    modal.classList.add("active");
    clearForm();
    commissionLinesSection.classList.add("hidden");
    commissionLinesTable.innerHTML = `<tr class="no-data">
      <td colspan="5" style="text-align: center; color: #aaa">
        No commission lines yet
      </td>
    </tr>`;
    editingRow = null;

    document.getElementById("agentDropDown").removeAttribute("disabled");
    document.getElementById("totalCommission").removeAttribute("disabled");
    document.getElementById("transactionNumber").removeAttribute("disabled");

    // Set status to Pending and disable it
    const statusDropdown = document.getElementById("status");
    statusDropdown.innerHTML = `<option value="Pending">Pending</option>`;
    statusDropdown.value = "Pending";
    statusDropdown.setAttribute("disabled", true);

    fetch("../../getlatestcommissionid.php")
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("transactionNumber").value =
          data.latestCommissionId + 1;
      })
      .catch(() => {
        document.getElementById("transactionNumber").value = "";
      });
  });

  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    commissionLinesTable.innerHTML = `<tr class="no-data">
      <td colspan="5" style="text-align: center; color: #aaa">
        No commission lines yet
      </td>
    </tr>`;
    clearForm();
    tabledata = [];
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      commissionLinesTable.innerHTML = "";
      clearForm();
      tabledata = [];
    }
  });

  function attachRowActions(row) {
    const editBtn = row.querySelector(".edit-btn");
    const deleteBtn = row.querySelector(".delete-btn");

    if (editBtn) {
      editBtn.addEventListener("click", () => {
        editingRow = row;
        const cells = row.cells;
        editingCommissionId = cells[0].textContent;
        document.getElementById("transactionNumber").value =
          cells[0].textContent;
        document.getElementById("agentDropDown").value = cells[1].textContent;
        document.getElementById("totalCommission").value = cells[2].textContent;

        // Always set status to Pending and disable it
        const statusDropdown = document.getElementById("status");
        statusDropdown.innerHTML = `<option value="Pending">Pending</option>`;
        statusDropdown.value = "Pending";
        statusDropdown.setAttribute("disabled", true);

        modal.classList.add("active");

        document.getElementById("agentDropDown").removeAttribute("disabled");
        document.getElementById("totalCommission").removeAttribute("disabled");
        document
          .getElementById("transactionNumber")
          .removeAttribute("disabled");
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this entry?")) {
          const commissionId = row.cells[0].textContent;
          fetch("../../deletecommission.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ CommissionID: commissionId }),
            credentials: "include",
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                row.remove();
              } else {
                alert(
                  "Failed to delete commission: " +
                    (data.error || "Unknown error")
                );
              }
            });
        }
      });
    }
  }

  function clearForm() {
    document.getElementById("agentDropDown").removeAttribute("disabled");
    document.getElementById("totalCommission").removeAttribute("disabled");
    document.getElementById("transactionNumber").removeAttribute("disabled");
    const statusDropdown = document.getElementById("status");
    statusDropdown.innerHTML = `<option value="Pending">Pending</option>`;
    statusDropdown.value = "Pending";
    statusDropdown.setAttribute("disabled", true);

    document.getElementById("agentDropDown").value = "";
    document.getElementById("commissionRate").value = "";
    document.getElementById("totalSales").value = "";
    document.getElementById("totalCommission").value = "";
    subtotal = 0;
    totalComm = 0;
  }

  addLineBtn.addEventListener("click", () => {
    const cardId = document.getElementById("cardsDropDown").value.trim();
    const clientName = document.getElementById("clientNameInput").value.trim();
    const quantity = parseFloat(
      document.getElementById("quantityInput").value.trim()
    );
    const amount = parseFloat(
      document.getElementById("cardAmount").value.trim()
    );
    const rate = parseInt(
      document.getElementById("commissionRate").value.trim()
    );
    const agentID = document.getElementById("agentDropDown").value.trim();

    if (!cardId || !clientName || isNaN(quantity) || isNaN(amount) || !rate) {
      alert("Please fill in all fields correctly.");
      return;
    }
    const total = (quantity * amount).toFixed(2);
    subtotal += quantity * amount;
    totalComm = subtotal * (rate / 100);

    document.getElementById("subtotal").value = subtotal;
    tabledata.push({
      cardId,
      agentID,
      clientName,
      quantity,
      amount,
      total,
      totalComm,
    });
    const row = `
      <tr>
        <td>${cardId}</td>
        <td contenteditable="true">${clientName}</td>
        <td contenteditable="true">${quantity}</td>
        <td contenteditable="true">${amount}</td>
        <td contenteditable="true">${total}</td>
      </tr>`;

    const noDataRow = commissionLinesTable.querySelector(".no-data");
    if (noDataRow) noDataRow.remove();

    commissionLinesTable.insertAdjacentHTML("beforeend", row);

    document.getElementById("cardsDropDown").value = "";
    document.getElementById("clientNameInput").value = "";
    document.getElementById("quantityInput").value = "";
    document.getElementById("cardAmount").value = "";
    document.getElementById("totalInput").value = "";

    document.getElementById("totalSales").value = subtotal;
    document.getElementById("totalCommission").value = totalComm;
  });

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // If editing, send all editable fields except status
    if (editingCommissionId) {
      const agentID = document.getElementById("agentDropDown").value;
      const totalCommission = document.getElementById("totalCommission").value;
      // Always set status to "Pending" when editing (per your requirement)
      const status = "Pending";

      fetch("../../updatecommission.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CommissionID: editingCommissionId,
          agentID,
          totalCommission,
          status,
        }),
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          commissionLinesTable.innerHTML = "";
          clearForm();
          loadCommissions();
          editingCommissionId = null;
        })
        .catch((err) => console.error("Error submitting data:", err));
      return;
    }

    if (tabledata.length == 0) {
      alert("No data to submit.");
      return;
    }

    let url = "../../createcommission.php";
    let method = "POST";
    let payload = tabledata;

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        tabledata = [];
        commissionLinesTable.innerHTML = "";
        clearForm();
        loadCommissions();
        editingCommissionId = null;
      })
      .catch((err) => console.error("Error submitting data:", err));
  });

  loadCommissions();

  document
    .getElementById("searchbar")
    .addEventListener("input", filterCommissionsTable);

  function filterCommissionsTable() {
    const search = document
      .getElementById("searchbar")
      .value.trim()
      .toLowerCase();
    const selectedStatus = document.getElementById(
      "approvalStatusFilter"
    ).value;
    const rows = document.querySelectorAll(".user-table tbody tr");
    rows.forEach((row) => {
      const commissionId = row.cells[0].textContent.toLowerCase();
      const agentName = row.cells[1].textContent.toLowerCase();
      const approvalStatus = row.cells[3].textContent;
      const matchesSearch =
        commissionId.includes(search) || agentName.includes(search);
      const matchesStatus =
        selectedStatus === "All" || approvalStatus === selectedStatus;
      row.style.display = matchesSearch && matchesStatus ? "" : "none";
    });
  }
});
