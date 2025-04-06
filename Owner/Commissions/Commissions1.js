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

    const userId = document.querySelector("input[placeholder='Enter commission id']").value;
    const positionId = document.querySelector("input[placeholder='Enter username']").value;
    const username = document.querySelector("input[placeholder='Enter agent name']").value;
    const password = document.querySelector("input[placeholder='Enter total commission']").value;
    const status = document.getElementById("status").value;

    if (userId && positionId && username && password) {
      if (editingRow) {
        editingRow.cells[0].textContent = userId;
        editingRow.cells[1].textContent = positionId;
        editingRow.cells[2].textContent = username;
        editingRow.cells[3].textContent = password;
        editingRow.cells[4].textContent = status;
        editingRow.dataset.password = password;
      } else {
        const newRow = document.createElement("tr");
        newRow.dataset.password = password; 
        newRow.innerHTML = `
          <td>${userId}</td>
          <td>${positionId}</td>
          <td>${username}</td>
          <td>${password}</td>
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
      document.querySelector("input[placeholder='Enter commission id']").value = cells[0].textContent;
      document.querySelector("input[placeholder='Enter username']").value = cells[1].textContent;
      document.querySelector("input[placeholder='Enter agent name']").value = cells[2].textContent;
      document.querySelector("input[placeholder='Enter total commission']").value = cells[3].textContent;
      document.getElementById("status").value = cells[4].textContent;

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
    document.querySelector("input[placeholder='Enter commission id']").value = "";
    document.querySelector("input[placeholder='Enter username']").value = "";
    document.querySelector("input[placeholder='Enter agent name']").value = "";
    document.querySelector("input[placeholder='Enter total commission']").value = "";
    document.getElementById("status").value = "";
  }

  document.querySelectorAll(".user-table tbody tr").forEach((row) => {
    attachRowActions(row);
  });
});

document.getElementById('viewCommissionLinesBtn').addEventListener('click', async (event) => {
  event.preventDefault();
  document.getElementById('commissionLinesModal').style.display = 'block';

  const response = await fetch('/api/commission_lines'); 
  const commissionLines = await response.json();

  const tbody = document.querySelector('.commission-lines-table tbody');
  tbody.innerHTML = ''; 

  commissionLines.forEach(line => {
    const row = `
      <tr>
        <td>${line.Coms_Lines}</td>
        <td>${line.CommissionID}</td>
        <td>${line.CardID}</td>
        <td>${line.ClientName}</td>
        <td>${line.Quantity}</td>
        <td>${line.Amount}</td>
        <td>${line.TotalAmount}</td>
      </tr>`;
    tbody.innerHTML += row;
  });
});

document.getElementById('closeCommissionLinesBtn').addEventListener('click', () => {
  document.getElementById('commissionLinesModal').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('commissionLinesModal').style.display = 'none';
});

document.getElementById('addLineBtn').addEventListener('click', () => {
  const lineId = document.getElementById('lineIdInput').value.trim();
  const commissionId = document.getElementById('commissionIdInput').value.trim();
  const cardId = document.getElementById('cardIdInput').value.trim();
  const clientName = document.getElementById('clientNameInput').value.trim();
  const quantity = document.getElementById('quantityInput').value.trim();
  const amount = document.getElementById('amountInput').value.trim();

  if (!lineId || !commissionId || !cardId || !clientName || !quantity || !amount) {
    alert('Please fill in all fields.');
    return;
  }

  const tbody = document.querySelector('.commission-lines-table tbody');
  const totalAmount = (parseFloat(quantity) * parseFloat(amount)).toFixed(2);

  const newRow = `
    <tr>
      <td>${lineId}</td>
      <td>${commissionId}</td>
      <td>${cardId}</td>
      <td>${clientName}</td>
      <td>${quantity}</td>
      <td>${amount}</td>
      <td>${totalAmount}</td>
    </tr>`;
  
  tbody.insertAdjacentHTML('beforeend', newRow);

  document.getElementById('lineIdInput').value = '';
  document.getElementById('commissionIdInput').value = '';
  document.getElementById('cardIdInput').value = '';
  document.getElementById('clientNameInput').value = '';
  document.getElementById('quantityInput').value = '';
  document.getElementById('amountInput').value = '';
});

