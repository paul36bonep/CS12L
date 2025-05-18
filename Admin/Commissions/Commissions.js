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
  console.log("Agent dropdown element:", agentDropDown);
  const cardsdropdown = document.getElementById("cardsDropDown");

  let editingRow = null;
  let editingCommissionId = null;

  function loadCommissions() {
    fetch("../../getcommissions.php")
      .then((res) => res.json())
      .then((commissions) => {
        const userTable = document.querySelector(".user-table tbody");
        userTable.innerHTML = ""; // Clear old rows
        commissions.forEach((c) => {
          userTable.insertAdjacentHTML(
            "beforeend",
            `
          <tr>
            <td>${c.CommissionID}</td>
            <td>${c.AgentName || ""}</td>
            <td>${c.TotalCommission}</td>
            <td>${c.ApprovalStatus}</td>
            <td>
              <button class="action-btn edit-btn"${
                c.ApprovalStatus === "Approved" ||
                c.ApprovalStatus === "Canceled"
                  ? ' style="display:none;"'
                  : ""
              }><span class="material-icons-sharp">edit</span></button>
              <button class="action-btn delete-btn"><span class="material-icons-sharp">delete</span></button>
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

  //the date today(dunno how this works just copied this.)
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const yyyy = today.getFullYear();

  const formattedDate = `${mm}/${dd}/${yyyy}`;
  document.getElementById("transactionDate").value = formattedDate;
  //the date today(dunno how this works just copied this.[end])

  //for the Agent names dropdown
  fetch("../../getagents.php")
    .then((response) => response.json())
    .then((agentnames) => {
      console.log("Agent names fetched:", agentnames); // Debugging log
      // Filter only active agents (if needed)
      const activeAgents = agentnames.filter((agent) => agent.status === "1");

      const agentDropdown = document.getElementById("agentDropDown");
      updateAgentsDropdown(agentDropdown, activeAgents, "id", "name");
    })
    .catch((error) => {
      console.error("Error fetching Agent names:", error);
    });

  function updateAgentsDropdown(dropdown, items, value, text) {
    dropdown.innerHTML = `
      <option value="">Select Agent</option>
    `;
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

        if (agent) {
          document.getElementById("commissionRate").value = agent.commission;
        } else {
          document.getElementById("commissionRate").value = "";
        }
      })

      .catch((error) => {
        console.error("Error fetching Agent names:", error);
      });
  });
  //for the Agent names dropdown(end)

  //for cards dropdown
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
    dropdown.innerHTML = `
      <option value="">Select Card</option>
    `;
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

        if (card) {
          document.getElementById("cardAmount").value = card.cardAmount;
        } else {
          document.getElementById("cardAmount").value = "";
        }
      })

      .catch((error) => {
        console.error("Error fetching Cards Information:", error);
      });
  });
  //for cards dropdown(end)

  //To calculate amount while typing Changes(start)
  const quantity = document.getElementById("quantityInput");

  quantity.addEventListener("change", function () {
    const quantityval = this.value;
    const amount = document.getElementById("cardAmount").value;

    if (quantityval && amount) {
      document.getElementById("totalInput").value = quantityval * amount;
    } else {
      document.getElementById("totalInput").value = "";
    }
  });
  //To calculate amount while typing Changes(end)

  openModalBtn.addEventListener("click", () => {
    modal.classList.add("active");
    clearForm();
    commissionLinesSection.classList.add("hidden");
    commissionLinesTable.innerHTML = ` <tr class="no-data">
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
        // Next transaction number is latest + 1
        document.getElementById("transactionNumber").value =
          data.latestCommissionId + 1;
      })
      .catch(() => {
        document.getElementById("transactionNumber").value = "";
      });
  });

  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    commissionLinesTable.innerHTML = ` <tr class="no-data">
      <td colspan="5" style="text-align: center; color: #aaa">
        No commission lines yet
      </td>
    </tr>`;
    clearForm();
    tabledata = []; // clear memory
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      commissionLinesTable.innerHTML = "";
      clearForm();
      tabledata = []; // clear memory
    }
  });

  // submitBtn.addEventListener("click", (e) => {
  //   e.preventDefault();

  //   const commissionId = document.getElementById("commissionId").value;
  //   const date = document.getElementById("date").value;
  //   const agent = document.getElementById("agent").value;
  //   const remarks = document.getElementById("remarks").value;

  //   if (commissionId && date && agent) {
  //     if (editingRow) {
  //       editingRow.cells[0].textContent = commissionId;
  //       editingRow.cells[1].textContent = "Prepared User";
  //       editingRow.cells[2].textContent = agent;
  //       editingRow.cells[3].textContent = "0.00";
  //       editingRow.cells[4].textContent = "Pending";
  //     } else {
  //       const newRow = document.createElement("tr");
  //       newRow.innerHTML = `
  //         <td>${commissionId}</td>
  //         <td>Prepared User</td>
  //         <td>${agent}</td>
  //         <td>0.00</td>
  //         <td>Pending</td>
  //         <td>
  //           <button class="action-btn edit-btn"><span class="material-icons-sharp">edit</span></button>
  //           <button class="action-btn delete-btn"><span class="material-icons-sharp">delete</span></button>
  //         </td>
  //       `;
  //       userTable.appendChild(newRow);
  //       attachRowActions(newRow);
  //     }

  //     commissionLinesSection.classList.remove("hidden");
  //   } else {
  //     alert("Please fill in all required fields.");
  //   }
  // });

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
        // If status is "Rejected", set to "Pending" for editing
        let statusValue = cells[3].textContent;
        if (statusValue === "Rejected") {
          statusValue = "Pending";
        }
        document.getElementById(
          "status"
        ).innerHTML = `<option value="Pending">Pending</option>`;
        document.getElementById("status").value = statusValue;

        modal.classList.add("active");

        // Enable all fields except status
        document.getElementById("agentDropDown").removeAttribute("disabled");
        document.getElementById("totalCommission").removeAttribute("disabled");
        document
          .getElementById("transactionNumber")
          .removeAttribute("disabled");
        document.getElementById("status").setAttribute("disabled", true);
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

  let tabledata = [];
  subtotal = 0;
  totalComm = 0;

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
    }); //store data to a temporary array.(clientside)
    console.log(subtotal + "Hey");
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

    // If editing, use update endpoint and include the commission ID
    if (editingCommissionId) {
      url = "../../updatecommission.php";
      method = "POST";
      payload = {
        CommissionID: editingCommissionId,
        lines: tabledata,
      };
    }

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
        editingCommissionId = null; // Reset after submit
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
    const rows = document.querySelectorAll(".user-table tbody tr");
    rows.forEach((row) => {
      const commissionId = row.cells[0].textContent.toLowerCase();
      const agentName = row.cells[1].textContent.toLowerCase();
      if (commissionId.includes(search) || agentName.includes(search)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }
});
