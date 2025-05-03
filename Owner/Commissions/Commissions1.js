document.addEventListener("DOMContentLoaded", () => {
  const openModalBtn = document.getElementById("openModalBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modal = document.getElementById("registerModal");
  const submitBtn = document.querySelector(".submit");
  const userTable = document.querySelector(".user-table tbody");
  const commissionLinesSection = document.getElementById("commissionLinesSection");
  const commissionLinesTable = document.querySelector(".commission-lines-table tbody");
  const addLineBtn = document.getElementById("addLineBtn");

  let editingRow = null;

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

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const commissionId = document.getElementById("commissionId").value;
    const date = document.getElementById("date").value;
    const agent = document.getElementById("agent").value;
    const remarks = document.getElementById("remarks").value;

    if (commissionId && date && agent) {
      if (editingRow) {
        editingRow.cells[0].textContent = commissionId;
        editingRow.cells[1].textContent = "Prepared User";
        editingRow.cells[2].textContent = agent;
        editingRow.cells[3].textContent = "0.00";
        editingRow.cells[4].textContent = "Pending";
      } else {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
          <td>${commissionId}</td>
          <td>Prepared User</td>
          <td>${agent}</td>
          <td>0.00</td>
          <td>Pending</td>
          <td>
            <button class="action-btn edit-btn"><span class="material-icons-sharp">edit</span></button>
            <button class="action-btn delete-btn"><span class="material-icons-sharp">delete</span></button>
          </td>
        `;
        userTable.appendChild(newRow);
        attachRowActions(newRow);
      }

      commissionLinesSection.classList.remove("hidden");
    } else {
      alert("Please fill in all required fields.");
    }
  });

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
    const cardId = document.getElementById("cardIdInput").value.trim();
    const clientName = document.getElementById("clientNameInput").value.trim();
    const quantity = parseFloat(document.getElementById("quantityInput").value.trim());
    const amount = parseFloat(document.getElementById("amountInput").value.trim());

    if (!cardId || !clientName || isNaN(quantity) || isNaN(amount)) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const total = (quantity * amount).toFixed(2);
    const row = `
      <tr>
        <td>${cardId}</td>
        <td>${clientName}</td>
        <td>${quantity}</td>
        <td>${amount}</td>
        <td>${total}</td>
      </tr>`;
    commissionLinesTable.insertAdjacentHTML("beforeend", row);

    document.getElementById("cardIdInput").value = "";
    document.getElementById("clientNameInput").value = "";
    document.getElementById("quantityInput").value = "";
    document.getElementById("amountInput").value = "";
  });

});
