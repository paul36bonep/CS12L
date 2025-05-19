document.addEventListener("DOMContentLoaded", () => {
  const cardModal = document.getElementById("registerModal");
  const bankModal = document.getElementById("bankModal");
  const cardTypeModal = document.getElementById("cardTypeModal");

  const openCardModalBtn = document.getElementById("openModalBtn");
  const closeCardModalBtn = document.getElementById("closeModalBtn");

  const bankDropdown = document.getElementById("bankDropdown");
  const cardTypeDropdown = document.getElementById("cardTypeDropdown");

  // const cardIdInput = document.getElementById("cardIdInput");
  const amountInput = document.getElementById("amountInput");
  const statusInput = document.getElementById("statusInput");
  const cardForm = document.getElementById("cardForm");

  fetch("../../getbanks.php")
    .then((response) => response.json())
    .then((banknames) => {
      updateDropdown(bankDropdown, banknames, "bankId", "bankName");
    })
    .catch((error) => {
      console.error("Error fetching bank names:", error);
    });

  fetch("../../getcardtypes.php")
    .then((response) => response.json())
    .then((cardTypes) => {
      updateDropdown(cardTypeDropdown, cardTypes, "cardTypeId", "cardTypeName");
    })
    .catch((error) => {
      console.error("Error fetching card types:", error);
    });

  const showModal = (modal) => modal.classList.add("active");
  const hideModal = (modal) => modal.classList.remove("active");

  openCardModalBtn.addEventListener("click", () => {
    editingIndex = null;
    clearForm();
    //updateCardIdField();
    showModal(cardModal);
  });

  closeCardModalBtn.addEventListener("click", () => hideModal(cardModal));

  cardForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const amount = amountInput.value;
    const status = statusInput.value === "Active" ? 1 : 0;
    const bankId = bankDropdown.value;
    const cardTypeId = cardTypeDropdown.value;

    if (!amount || bankId === "" || cardTypeId === "") {
      alert("Please fill in all fields.");
      return;
    }

    const payload = {
      cardType: cardTypeId,
      bank: bankId,
      cardAmount: amount,
      status: status,
    };

    const url = editingIndex ? `updatecard.php` : `../../addcard.php`;

    if (editingIndex) {
      payload.cardId = editingIndex;
    }

    //console.log("Status being sent:", status); for debugging purposes

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert(
            editingIndex
              ? "Card updated successfully!"
              : "Card added successfully!"
          );
          editingIndex = null;
          hideModal(cardModal);
          clearForm();
          renderCardTable();
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Card submit error:", error);
        alert("Error processing card");
      });
  });

  function getNextCardId() {
    let nextId = parseInt(localStorage.getItem("nextCardId"));
    if (!nextId) {
      nextId = 110002;
      localStorage.setItem("nextCardId", nextId);
    }
    return nextId;
  }

  // function updateCardIdField() {
  //   cardIdInput.value = getNextCardId();
  // }

  function updateDropdown(dropdown, items, valueKey, textKey) {
    dropdown.innerHTML = `
      <option value="">Select</option>
      <option value="define-new">Define New</option>
    `;
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item[valueKey];
      option.textContent = item[textKey];
      dropdown.appendChild(option);
    });
  }

  function clearForm() {
    amountInput.value = "";
    statusInput.value = "Active";
    bankDropdown.value = "";
    cardTypeDropdown.value = "";
  }

  /*renderCardTable();

  document.getElementById("searchbar").addEventListener("input", (e) => {
    const searchText = e.target.value;
    renderCardTable(searchText);
  });*/

  const cardTypeFilter = document.getElementById("cardTypeFilter");
  const statusFilter = document.getElementById("statusFilter");
  const searchBar = document.getElementById("searchbar");

  // Populate card type filter dynamically
  fetch("../../getcardtypes.php")
    .then((res) => res.json())
    .then((types) => {
      // Clear existing options except "All"
      cardTypeFilter.innerHTML = '<option value="All">All Card Types</option>';
      types.forEach((type) => {
        const opt = document.createElement("option");
        opt.value = type.cardTypeName;
        opt.textContent = type.cardTypeName;
        cardTypeFilter.appendChild(opt);
      });
    });

  // Add event listeners for filters
  cardTypeFilter.addEventListener("change", () =>
    renderCardTable(searchBar.value)
  );
  statusFilter.addEventListener("change", () =>
    renderCardTable(searchBar.value)
  );
  searchBar.addEventListener("input", (e) => renderCardTable(e.target.value));

  renderCardTable();
});

function handleBankDropdownChange(select) {
  if (select.value === "define-new") {
    select.value = "";
    document.getElementById("bankModal").style.display = "block";
  }
}

function handleCardTypeDropdownChange(select) {
  if (select.value === "define-new") {
    select.value = "";
    document.getElementById("cardTypeModal").style.display = "block";
  }
}

function closeBankModal() {
  document.getElementById("bankModal").style.display = "none";
  document.getElementById("newBankName").value = "";
  document.getElementById("bankDropdown").value = "";
}

function closeCardTypeModal() {
  document.getElementById("cardTypeModal").style.display = "none";
  document.getElementById("newCardTypeName").value = "";
}

function addNewBank() {
  const value = document.getElementById("newBankName").value.trim();
  if (value) {
    let banks = JSON.parse(localStorage.getItem("banks")) || [];
    const newBank = { bankId: value, bankName: value };
    banks.push(newBank);
    localStorage.setItem("banks", JSON.stringify(banks));

    updateDropdown(
      document.getElementById("bankDropdown"),
      banks,
      "bankId",
      "bankName"
    );
    document.getElementById("bankDropdown").value = value;
    closeBankModal();
  } else {
    alert("Bank name cannot be empty!");
    return;
  }
}

function addNewCardType() {
  const value = document.getElementById("newCardTypeName").value.trim();
  if (value) {
    let cardTypes = JSON.parse(localStorage.getItem("cardTypes")) || [];
    const newType = { cardTypeId: value, cardTypeName: value };
    cardTypes.push(newType);
    localStorage.setItem("cardTypes", JSON.stringify(cardTypes));

    updateDropdown(
      document.getElementById("cardTypeDropdown"),
      cardTypes,
      "cardTypeId",
      "cardTypeName"
    );
    document.getElementById("cardTypeDropdown").value = value;
    closeCardTypeModal();
  } else {
    alert("Card type name cannot be empty!");
    return;
  }
}

let editingIndex = null;

function renderCardTable(filterText = "") {
  const tbody = document.querySelector(".user-table tbody");
  tbody.innerHTML = "";

  const selectedCardType = document.getElementById("cardTypeFilter").value;
  const selectedStatus = document.getElementById("statusFilter").value;

  fetch("../../getcards.php")
    .then((res) => res.json())
    .then((cards) => {
      const search = filterText.toLowerCase();

      const filteredCards = cards.filter((card) => {
        const matchesSearch =
          String(card.cardId).toLowerCase().includes(search) ||
          (card.bankName || "").toLowerCase().includes(search) ||
          (card.cardType || "").toLowerCase().includes(search);

        const matchesType =
          selectedCardType === "All" || card.cardType === selectedCardType;

        const matchesStatus =
          selectedStatus === "All" || card.status === selectedStatus;

        return matchesSearch && matchesType && matchesStatus;
      });

      filteredCards.forEach((card) => {
        const row = document.createElement("tr");
        const statusClass =
          card.status === "Active" ? "status-active" : "status-inactive";
        row.innerHTML = `
    <td>${card.cardId}</td>
    <td>${card.bankName}</td>
    <td>${card.cardType}</td>
    <td>${card.cardAmount}</td>
    <td class="${statusClass}">${card.status}</td>
    <td>
      <button class="action-btn edit-btn" onclick="editCard('${card.cardId}')">
        <span class="material-icons-sharp">edit</span>
        <span class="btn-label edit-label">Edit</span>
      </button>
      <button class="action-btn delete-btn" onclick="deleteCard('${card.cardId}')">
        <span class="material-icons-sharp">delete</span>
        <span class="btn-label delete-label">Delete</span>
      </button>
    </td>
  `;
        tbody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Error fetching cards:", err);
    });
}

function deleteCard(cardId) {
  if (!confirm("Are you sure you want to delete this card?")) return;

  fetch("deletecard.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cardId }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Card deleted successfully!");
        renderCardTable(document.getElementById("searchbar").value);
      } else {
        alert("Error deleting card: " + data.message);
      }
    })
    .catch((err) => {
      console.error("Error deleting card:", err);
      alert("Failed to delete card.");
    });
}

function editCard(cardId) {
  fetch(`getcardbyid.php?cardId=${cardId}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.success || !data.card) {
        alert("Card not found.");
        return;
      }

      const card = data.card;

      // Fill the modal with the fetched data
      document.getElementById("amountInput").value = card.amount;
      console.log("Setting status to:", card.status);
      document.getElementById("statusInput").value =
        card.status === "Active" ? "Active" : "Inactive";

      const bankDropdown = document.getElementById("bankDropdown");
      const cardTypeDropdown = document.getElementById("cardTypeDropdown");

      bankDropdown.value = card.bankId;
      cardTypeDropdown.value = card.cardTypeId;

      // Store editing cardId in a global variable
      editingIndex = card.cardId;
      document.getElementById("registerModal").classList.add("active");
    })
    .catch((err) => console.error("Error fetching card for edit:", err));
}
