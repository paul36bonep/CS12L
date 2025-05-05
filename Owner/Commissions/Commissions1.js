document.addEventListener("DOMContentLoaded", () => {
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modal = document.getElementById("registerModal");
  const submitBtn = document.querySelector(".submit");
  const userTable = document.querySelector(".user-table tbody");
  const commissionLinesSection = document.getElementById(
    "commissionLinesSection"
  );
  const commissionLinesTable = document.querySelector(
    ".commission-lines-table tbody"
  );
  const addLineBtn = document.getElementById("addLineBtn");
  const agentdropdown = document.getElementById("agentDropDown");
  const cardsdropdown = document.getElementById("cardsDropDown");

  let editingRow = null;

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
      updateAgentsDropdown(agentdropdown, agentnames, "agentId", "agentName");
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
        const agent = agentnames.find((agent) => agent.agentId == thisagentId);

        if (agent) {
          document.getElementById("commissionRate").value =
            agent.commissionRate;
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
      updateCardsDropdown(cardsdropdown, cards, "cardId", "cardType");
    })
    .catch((error) => {
      console.error("Error fetching Cards information:", error);
    });

  function updateCardsDropdown(dropdown, items, value, text) {
    dropdown.innerHTML = `
      <option value="">Select Card</option>
    `;
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item[value];
      option.textContent = item[text];
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
    console.log(amount);
    console.log(quantityval);

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
    commissionLinesTable.innerHTML = "";
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

    editBtn.addEventListener("click", () => {
      editingRow = row;
      const cells = row.cells;
      document.getElementById("commissionId").value = cells[0].textContent;
      document.getElementById("agent").value = cells[2].textContent;
      document.getElementById("remarks").value = "";
      modal.classList.add("active");
    });

    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this entry?")) {
        row.remove();
      }
    });
  }

  function clearForm() {
    document.getElementById("commissionId").value = "";
    document.getElementById("date").value = "";
    document.getElementById("agent").value = "";
    document.getElementById("remarks").value = "";
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

    if (!cardId || !clientName || isNaN(quantity) || isNaN(amount)) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const total = (quantity * amount).toFixed(2);
    const row = `
      <tr id="row${cardId}">
        <td>${cardId}</td>
        <td>${clientName}</td>
        <td>${quantity}</td>
        <td>${amount}</td>
        <td>${total}</td>
      </tr>`;

    commissionLinesTable.insertAdjacentHTML("beforeend", row);

    document.getElementById("cardDropDown").value = "";
    document.getElementById("clientNameInput").value = "";
    document.getElementById("quantityInput").value = "";
    document.getElementById("amountInput").value = "";
  });
});
