const ctx = document.getElementById("myChart").getContext("2d");

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const data = {
  labels: labels,
  datasets: [
    {
      label: "Commission Trends",
      data: [
        10000, 20000, 30000, 40000, 50000, 60000, 30000, 50000, 45000, 55000,
        70000, 80000,
      ],
      borderColor: "rgb(75,192,192)",
      backgroundColor: "rgba(75,192,192,0.2)",
      tension: 0.1,
      fill: {
        target: "origin",
      },
    },
    {
      label: "Sales Trends",
      data: [
        20000, 25000, 35000, 42000, 60000, 70000, 40000, 60000, 50000, 65000,
        80000, 90000,
      ],
      borderColor: "rgb(75, 118, 236)",
      backgroundColor: "rgba(32, 85, 199, 0.2)",
      tension: 0.1,
      fill: { target: "origin" },
    },
  ],
};

const config = {
  type: "line",
  data: data,
  options: {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
        },
      },
    },
  },
};

const myCghart = new Chart(ctx, config);
