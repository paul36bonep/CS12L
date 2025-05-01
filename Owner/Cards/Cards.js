document.addEventListener("DOMContentLoaded", () => {

  const cardModal = document.getElementById("registerModal");
  const bankModal = document.getElementById("bankModal");
  const cardTypeModal = document.getElementById("cardTypeModal");

  const openCardModalBtn = document.getElementById("openModalBtn");
  const closeCardModalBtn = document.getElementById("closeModalBtn");
  const openBankModalBtn = document.getElementById("openBankModalBtn");
  const closeBankModalBtn = document.getElementById("closeBankModalBtn");
  const openCardTypeModalBtn = document.getElementById("openCardTypeModalBtn");
  const closeCardTypeModalBtn = document.getElementById("closeCardTypeModalBtn");

  const bankDropdown = document.getElementById("bankDropdown");
  const cardTypeDropdown = document.getElementById("cardTypeDropdown");

  const bankForm = document.getElementById("bankForm");
  const cardTypeForm = document.getElementById("cardTypeForm");

  const banks = [];
  const cardTypes = [];

  const showModal = (modal) => modal.classList.add("active");
  const hideModal = (modal) => modal.classList.remove("active");

  openCardModalBtn.addEventListener("click", () => showModal(cardModal));
  closeCardModalBtn.addEventListener("click", () => hideModal(cardModal));

  openBankModalBtn.addEventListener("click", () => showModal(bankModal));
  closeBankModalBtn.addEventListener("click", () => hideModal(bankModal));

  openCardTypeModalBtn.addEventListener("click", () => showModal(cardTypeModal));
  closeCardTypeModalBtn.addEventListener("click", () => hideModal(cardTypeModal));

  bankForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const bankId = document.getElementById("bankIdInput").value.trim();
    const bankName = document.getElementById("bankNameInput").value.trim();

    if (bankId && bankName) {
      banks.push({ bankId, bankName });
      updateDropdown(bankDropdown, banks, "bankId", "bankName");
      alert("Bank added successfully!");

      bankForm.reset();
      hideModal(bankModal);
    } else {
      alert("Please fill in all fields for the bank.");
    }
  });

  cardTypeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const cardTypeId = document.getElementById("cardTypeIdInput").value.trim();
    const cardTypeName = document.getElementById("cardTypeNameInput").value.trim();

    if (cardTypeId && cardTypeName) {
      cardTypes.push({ cardTypeId, cardTypeName });
      updateDropdown(cardTypeDropdown, cardTypes, "cardTypeId", "cardTypeName");
      alert("Card Type added successfully!");

      cardTypeForm.reset();
      hideModal(cardTypeModal);
    } else {
      alert("Please fill in all fields for the card type.");
    }
  });

  function updateDropdown(dropdown, items, valueKey, textKey) {
    dropdown.innerHTML = '<option value="">Select</option>'; 
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item[valueKey];
      option.textContent = item[textKey];
      dropdown.appendChild(option);
    });
  }

  banks.push({ bankId: "1", bankName: "BDO" }, { bankId: "2", bankName: "BPI" });
  cardTypes.push({ cardTypeId: "1", cardTypeName: "Platinum" }, { cardTypeId: "2", cardTypeName: "Gold" });

  updateDropdown(bankDropdown, banks, "bankId", "bankName");
  updateDropdown(cardTypeDropdown, cardTypes, "cardTypeId", "cardTypeName");
});
