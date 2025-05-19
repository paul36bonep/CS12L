document.addEventListener("DOMContentLoaded", () => {
  // Tab selectors
  const tab1 = document.querySelector('.tab[data-tab="1"]');
  const tab2 = document.querySelector('.tab[data-tab="2"]');
  const tab3 = document.querySelector('.tab[data-tab="3"]');
  const tab4 = document.querySelector('.tab[data-tab="4"]');

  // Table bodies
  const table1Body = document.querySelector("#tab-1-table tbody");
  const table2Body = document.querySelector("#tab-2-table tbody");
  const table3Body = document.querySelector("#tab-3-table tbody");
  const table4Body = document.querySelector("#tab-4-table tbody");

  // Filter selects
  const agentSelect = document.getElementById("agent-select");
  const cardSelect = document.getElementById("card-select");
  const areaSelect = document.getElementById("area-select");

  // Load all commissions
  function loadAllCommissions() {
    fetch("../../get_report_commissions.php")
      .then((res) => res.json())
      .then((data) => {
        table1Body.innerHTML = "";
        data.forEach((row) => {
          table1Body.innerHTML += `
            <tr>
              <td>${row.transaction_date}</td>
              <td>${row.agent}</td>
              <td>${row.total_sales}</td>
              <td>${row.commission_rate}</td>
              <td>${row.commission_total}</td>
            </tr>
          `;
        });
      });
  }

  // Load sales per agent
  function loadSalesPerAgent(agentId) {
    let url = "../../get_report_agent.php";
    if (agentId && agentId !== "all") {
      url += `?agentId=${encodeURIComponent(agentId)}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        table2Body.innerHTML = "";
        data.forEach((row) => {
          table2Body.innerHTML += `
          <tr>
            <td>${row.transaction_date}</td>
            <td>${row.client_name}</td>
            <td>${row.card}</td>
            <td>${row.amount}</td>
            <td>${row.quantity}</td>
            <td>${row.total}</td>
          </tr>
        `;
        });
      });
  }

  function populateAgentDropdown() {
    fetch("../../getagents.php")
      .then((res) => res.json())
      .then((agents) => {
        agentSelect.innerHTML = `<option value="all">All Agents</option>`;
        agents.forEach((agent) => {
          agentSelect.innerHTML += `<option value="${agent.id}">${agent.name}</option>`;
        });
        // Load all agents' sales by default
        loadSalesPerAgent("all");
      });
  }

  // Load sales per card
  function loadSalesPerCard(cardId) {
    fetch(`../../get_report_card.php?cardId=${encodeURIComponent(cardId)}`)
      .then((res) => res.json())
      .then((data) => {
        table3Body.innerHTML = "";
        data.forEach((row) => {
          table3Body.innerHTML += `
            <tr>
              <td>${row.transaction_date}</td>
              <td>${row.agent}</td>
              <td>${row.client_name}</td>
              <td>${row.amount}</td>
              <td>${row.quantity}</td>
              <td>${row.total}</td>
            </tr>
          `;
        });
      });
  }

  function populateCardDropdown() {
    fetch("../../getcards.php")
      .then((res) => res.json())
      .then((cards) => {
        cardSelect.innerHTML = `<option value="all_cards">All Cards</option>`;
        cards.forEach((card) => {
          cardSelect.innerHTML += `<option value="${card.cardId}">${card.bankName} ${card.cardType}</option>`;
        });
        // Optionally load all cards' sales by default
        loadSalesPerCard("all_cards");
      });
  }

  // Load sales per area
  function loadSalesPerArea(area) {
    fetch(`../../get_report_area.php?area=${encodeURIComponent(area)}`)
      .then((res) => res.json())
      .then((data) => {
        table4Body.innerHTML = "";
        data.forEach((row) => {
          table4Body.innerHTML += `
            <tr>
              <td>${row.transaction_date}</td>
              <td>${row.agent}</td>
              <td>${row.card}</td>
              <td>${row.client_name}</td>
              <td>${row.amount}</td>
              <td>${row.quantity}</td>
              <td>${row.total}</td>
            </tr>
          `;
        });
      });
  }

  function populateAreaDropdown() {
    fetch("../../getagents.php")
      .then((res) => res.json())
      .then((agents) => {
        // Get unique areas
        const areas = [
          ...new Set(
            agents
              .map((agent) => agent.area)
              .filter((area) => area && area.trim() !== "")
          ),
        ];
        areaSelect.innerHTML = `<option value="all_areas">All Areas</option>`;
        areas.forEach((area) => {
          areaSelect.innerHTML += `<option value="${area}">${area}</option>`;
        });
        // Optionally load all areas' sales by default
        loadSalesPerArea("all_areas");
      });
  }

  // Tab click handlers
  tab1.addEventListener("click", loadAllCommissions);
  tab2.addEventListener("click", () => loadSalesPerAgent(agentSelect.value));
  tab3.addEventListener("click", () => loadSalesPerCard(cardSelect.value));
  tab4.addEventListener("click", () => loadSalesPerArea(areaSelect.value));

  // Filter change handlers
  agentSelect.addEventListener("change", () =>
    loadSalesPerAgent(agentSelect.value)
  );
  cardSelect.addEventListener("change", () =>
    loadSalesPerCard(cardSelect.value)
  );
  areaSelect.addEventListener("change", () =>
    loadSalesPerArea(areaSelect.value)
  );

  // Initial load
  loadAllCommissions();
  populateAgentDropdown();
  populateCardDropdown();
  populateAreaDropdown();
});

function printCurrentTab() {
  const activePanel = document.querySelector(".tab-panel.active");
  if (!activePanel) return;

  const heading = activePanel.querySelector("h2")
    ? activePanel.querySelector("h2").outerHTML
    : "";
  const table = activePanel.querySelector("table")
    ? activePanel.querySelector("table").outerHTML
    : "";

  if (!table) return;

  const logoUrl = "../../images/EZD.jpg"; // Adjust path as needed

  const printWindow = window.open("", "", "height=600,width=900");
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Report</title>
        <link rel="stylesheet" href="Reports.css">
        <style>
          body { background: #fff; color: #000; }
          .print-header { text-align: center; margin-bottom: 20px; }
          .print-logo { width: 80px; height: auto; margin-bottom: 10px; }
          .print-title { font-size: 1.6rem; font-weight: bold; margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { padding: 10px 18px; border: 1px solid #333; text-align: center; }
          th { background: #f5f5f5; }
        </style>
      </head>
      <body>
        <div class="print-header">
          <img id="print-logo" src="${logoUrl}" class="print-logo" alt="EZD Marketing Logo" />
          <div class="print-title">EZD Marketing</div>
        </div>
        ${heading}
        ${table}
      </body>
    </html>
  `);
  printWindow.document.close();

  // Fallback: print after 2 seconds if onload events don't fire
  const fallback = setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, 2000);

  printWindow.onload = function () {
    // Wait for the logo image to load
    const logoImg = printWindow.document.getElementById("print-logo");
    if (logoImg) {
      logoImg.onload = function () {
        clearTimeout(fallback);
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
      logoImg.onerror = function () {
        clearTimeout(fallback);
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    } else {
      clearTimeout(fallback);
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };
}
