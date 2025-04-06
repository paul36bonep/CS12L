document.addEventListener("DOMContentLoaded", () => {
  const generateDetailedReportBtn = document.getElementById("generateDetailedReport");
  const generateSummaryReportBtn = document.getElementById("generateSummaryReport");
  const printReportBtn = document.getElementById("printReport");
  const reportTableWrapper = document.getElementById("reportTableWrapper");
  const reportTable = document.getElementById("reportTable");
  const reportTitle = document.getElementById("reportTitle");

  const commissionLines = [
    { Coms_Lines: 1, CommissionID: 101, CardID: 1, ClientName: "Angelo Morales", Quantity: 2, Amount:  40000, TotalAmount:  80000 }
  ];

  const summaryData = [
    { AgentName: "Dan Oro", TotalCommissions: 60000, Transactions: 1 },
  ];

  generateDetailedReportBtn.addEventListener("click", () => {
    reportTitle.textContent = "Detailed Commission Report";
    reportTableWrapper.style.display = "block";

    const headers = ["Commission Line ID", "Commission ID", "Card ID", "Client Name", "Quantity", "Amount", "Total Amount"];
    populateTableHeaders(headers);

    const rows = commissionLines.map(line => [
      line.Coms_Lines,
      line.CommissionID,
      line.CardID,
      line.ClientName,
      line.Quantity,
      `₱${line.Amount.toFixed(2)}`,
      `₱${line.TotalAmount.toFixed(2)}`
    ]);
    populateTableRows(rows);
  });

  generateSummaryReportBtn.addEventListener("click", () => {
    reportTitle.textContent = "Summary Commission Report";
    reportTableWrapper.style.display = "block";

    const headers = ["Agent Name", "Total Commissions", "Transactions"];
    populateTableHeaders(headers);

    const rows = summaryData.map(summary => [
      summary.AgentName,
      `₱${summary.TotalCommissions.toFixed(2)}`,
      summary.Transactions
    ]);
    populateTableRows(rows);
  });

  printReportBtn.addEventListener("click", () => {
    if (reportTableWrapper.style.display !== "none") {
      window.print();
    } else {
      alert("Please generate a report before printing.");
    }
  });

  function populateTableHeaders(headers) {
    const thead = reportTable.querySelector("thead");
    thead.innerHTML = ""; 
    const row = document.createElement("tr");
    headers.forEach(header => {
      const th = document.createElement("th");
      th.textContent = header;
      row.appendChild(th);
    });
    thead.appendChild(row);
  }

  function populateTableRows(rows) {
    const tbody = reportTable.querySelector("tbody");
    tbody.innerHTML = ""; 
    rows.forEach(rowData => {
      const row = document.createElement("tr");
      rowData.forEach(cellData => {
        const td = document.createElement("td");
        td.textContent = cellData;
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
  }
});
