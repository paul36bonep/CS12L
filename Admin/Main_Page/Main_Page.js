const sideMenu = document.querySelector("aside");
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");

const darkMode = document.querySelector(".dark-mode");

menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

darkMode.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode-variables");
  darkMode.querySelector("span:nth-child(1)").classList.toggle("active");
  darkMode.querySelector("span:nth-child(2)").classList.toggle("active");
});

// === Dynamic Dashboard Data ===
document.addEventListener("DOMContentLoaded", () => {
  fetch("../../getagents.php")
    .then((res) => res.json())
    .then((agents) => {
      // Get a set of active agent IDs (as numbers)
      const activeAgentIDs = new Set(
        agents
          .filter(
            (a) => a.status == 1 || a.status === "1" || a.status === "Active"
          )
          .map((a) => parseInt(a.id))
      );

      // Now fetch commissions
      fetch("../../get_report_commissions.php")
        .then((res) => res.json())
        .then((commissions) => {
          // Filter commissions to only those by active agents
          const activeCommissions = commissions.filter((c) =>
            activeAgentIDs.has(parseInt(c.AgentID))
          );

          // 1. Total Commissions (active agents only)
          const totalCommissions = activeCommissions.reduce(
            (sum, c) => sum + parseFloat(c.commission_total || 0),
            0
          );
          document.querySelector(
            ".sales .info h1"
          ).textContent = `₱${totalCommissions.toLocaleString()}`;

          // 2. Sales Count (number of sales by active agents)
          const salesCount = activeCommissions.reduce(
            (sum, c) => sum + parseInt(c.sales_count || 0),
            0
          );
          document.querySelector(".visits .info h1").textContent = salesCount;

          // 3. Top Agent (active agents only)
          const agentTotals = {};
          activeCommissions.forEach((c) => {
            if (!agentTotals[c.agent]) agentTotals[c.agent] = 0;
            agentTotals[c.agent] += parseFloat(c.commission_total || 0);
          });
          let topAgent = "";
          let maxCommission = 0;
          for (const [agent, total] of Object.entries(agentTotals)) {
            if (total > maxCommission) {
              maxCommission = total;
              topAgent = agent;
            }
          }
          document.querySelector(".searches .info h1").textContent =
            topAgent || "N/A";

          // Group sales amount by agent for recent sales (active agents only)
          const agentSalesAmount = {};
          activeCommissions.forEach((c) => {
            if (!agentSalesAmount[c.agent]) agentSalesAmount[c.agent] = 0;
            agentSalesAmount[c.agent] += parseFloat(c.total_sales || 0);
          });

          // Get the tbody element of the recent sales table
          const recentSalesTbody = document.querySelector(
            ".recent-commissions table tbody"
          );
          recentSalesTbody.innerHTML = ""; // Clear previous rows

          // For each commission (individual sale), show agent, card, amount, and approval status
          activeCommissions.forEach((c) => {
            const isApproved =
              (c.ApprovalStatus || "").toLowerCase() === "approved";
            const statusClass = isApproved ? "status-approved" : "";
            const tr = document.createElement("tr");
            tr.innerHTML = `
    <th>
      ${c.agent}
      <div style="font-size:0.9em; color:#888;">
        <small>${c.card ? c.card : ""}</small>
      </div>
    </th>
    <td>
      ₱${parseFloat(c.total_sales || 0).toLocaleString()}
      <div class="${statusClass}" style="margin-top:0.3rem;">
        <small>${c.ApprovalStatus || ""}</small>
      </div>
    </td>
  `;
            recentSalesTbody.appendChild(tr);
          });
        });
    });
});
