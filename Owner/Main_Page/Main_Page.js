const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

const darkMode = document.querySelector('.dark-mode');

menuBtn.addEventListener('click', () => {
  sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  sideMenu.style.display = 'none';
});

darkMode.addEventListener('click', () =>{
  document.body.classList.toggle('dark-mode-variables');
  darkMode.querySelector('span:nth-child(1)').classList.toggle('active');
  darkMode.querySelector('span:nth-child(2)').classList.toggle('active');
  
})

Commissions.forEach(commission =>{
  const tr = document.createElement('tr');
  const trContent = `
      <td>${commission.agentName}</td>
      <td>${commission.agentNumber}</td>
      <td>${commission.cardType}</td>
      <td class="${commission.status === 'Declined' ? 'danger' : commission.status === 'Inactive' ? 'warning'
        : 'primary'}">${commission.status}</td>
        <td class="primary">Details</td>
  `;
  tr.innerHTML = trContent;
  document.querySelector('table tbody').appendChild(tr);
});