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
  .then(response => response.json())
  .then(banknames => {
    updateDropdown(bankDropdown, banknames, "bankId", "bankName");
  })
  .catch(error => {
    console.error("Error fetching bank names:", error);
  });

  fetch("../../getcardtypes.php")
  .then(response => response.json())
  .then(cardTypes => {
    updateDropdown(cardTypeDropdown, cardTypes, "cardTypeId", "cardTypeName");
  })
  .catch(error => {
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

  // cardForm.addEventListener("submit", (e) => {
  //   e.preventDefault();

  //   const cardId = parseInt(cardIdInput.value);
  //   const amount = amountInput.value;
  //   const status = statusInput.value;
  //   const bank = bankDropdown.options[bankDropdown.selectedIndex].text;
  //   const cardType = cardTypeDropdown.options[cardTypeDropdown.selectedIndex].text;

  //   const cards = JSON.parse(localStorage.getItem("cards")) || [];
  //   const cardData = { cardId, amount, status, bank, cardType };

  //   if (editingIndex !== null) {
  //     cards[editingIndex] = cardData;
  //   } else {
  //     cards.push(cardData);
  //     localStorage.setItem("nextCardId", cardId + 1);
  //   }

  //   localStorage.setItem("cards", JSON.stringify(cards));
  //   alert(editingIndex !== null ? "Card updated successfully!" : "Card added successfully!");
  //   editingIndex = null;

  //   hideModal(cardModal);
  //   clearForm();
  //   updateCardIdField();
  //   renderCardTable();
  // });

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

  renderCardTable();

  document.getElementById("searchbar").addEventListener("input", (e) => {
    const searchText = e.target.value;
    renderCardTable(searchText);
  });
  
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

    updateDropdown(document.getElementById("bankDropdown"), banks, "bankId", "bankName");
    document.getElementById("bankDropdown").value = value;
    closeBankModal();
  }else{
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

    updateDropdown(document.getElementById("cardTypeDropdown"), cardTypes, "cardTypeId", "cardTypeName");
    document.getElementById("cardTypeDropdown").value = value;
    closeCardTypeModal();
  }else{
    alert("Card type name cannot be empty!");
    return;
  }
}

let editingIndex = null;

function renderCardTable(filterText = "") {
  const tbody = document.querySelector(".user-table tbody");
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  tbody.innerHTML = "";

  const filteredCards = cards.filter(card => {
    const searchText = filterText.toLowerCase();
    return (
      card.bank.toLowerCase().includes(searchText) ||
      card.cardType.toLowerCase().includes(searchText) ||
      card.status.toLowerCase().includes(searchText)
    );
  });

  filteredCards.forEach((card, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${card.cardId}</td>
      <td>${card.bank}</td>
      <td>${card.cardType}</td>
      <td>${card.amount}</td>
      <td>${card.status}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editCard(${card.cardId})">
          <i class="uil uil-edit"></i>
        </button>
        <button class="action-btn delete-btn" onclick="deleteCard(${card.cardId})">
          <i class="uil uil-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}


function deleteCard(cardId) {
  let cards = JSON.parse(localStorage.getItem("cards")) || [];
  cards = cards.filter(c => c.cardId !== cardId);
  localStorage.setItem("cards", JSON.stringify(cards));
  renderCardTable(document.getElementById("searchbar").value);
  alert("Card successfully deleted!");
}

function editCard(cardId) {
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  const index = cards.findIndex(c => c.cardId === cardId);
  if (index === -1) return;

  const card = cards[index];
  editingIndex = index;

  document.getElementById("cardIdInput").value = card.cardId;
  document.getElementById("amountInput").value = card.amount;
  document.getElementById("statusInput").value = card.status;

  const bankDropdown = document.getElementById("bankDropdown");
  const cardTypeDropdown = document.getElementById("cardTypeDropdown");

  for (let i = 0; i < bankDropdown.options.length; i++) {
    if (bankDropdown.options[i].text === card.bank) {
      bankDropdown.selectedIndex = i;
      break;
    }
  }

  for (let i = 0; i < cardTypeDropdown.options.length; i++) {
    if (cardTypeDropdown.options[i].text === card.cardType) {
      cardTypeDropdown.selectedIndex = i;
      break;
    }
  }
  document.getElementById("registerModal").classList.add("active");
}
