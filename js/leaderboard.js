document.addEventListener('DOMContentLoaded', function() {
    // Simulate fetching data and displaying it
    const donations = [
      { name: 'Samantha', amount: 1020 },
      { name: 'Bernadette', amount: 1000 },
      { name: 'Alexandra', amount: 720 },
      { name: 'John Doe', amount: 600 },
      { name: 'Jane Doe', amount: 500 },
      { name: 'Alex Smith', amount: 400 }
    ];
  
    displayTopDonors(donations);
    displayLeaderboard(donations);
  
    document.getElementById('searchDonor').addEventListener('input', filterDonors);
  });
  
  function displayTopDonors(data) {
    const topDonors = data.slice(0, 3); // Get top 3 donors
    const topDonorsContainer = document.getElementById('topDonors');
    topDonorsContainer.innerHTML = '';
  
    topDonors.forEach(donor => {
      const card = document.createElement('div');
      card.className = 'top-donor-card';
  
      const img = document.createElement('img');
      img.src = `avatar-placeholder.png`; // Placeholder image, replace with actual avatar
  
      const name = document.createElement('h3');
      name.textContent = donor.name;
  
      const amount = document.createElement('p');
      amount.textContent = `$${donor.amount.toFixed(2)}`;
  
      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(amount);
      topDonorsContainer.appendChild(card);
    });
  }
  
  function displayLeaderboard(data) {
    const leaderboardBody = document.querySelector('#leaderboard tbody');
    leaderboardBody.innerHTML = '';
  
    data.forEach((donor, index) => {
      const row = document.createElement('tr');
      const rankCell = document.createElement('td');
      const nameCell = document.createElement('td');
      const amountCell = document.createElement('td');
  
      rankCell.textContent = index + 1;
      nameCell.textContent = donor.name;
      amountCell.textContent = `$${donor.amount.toFixed(2)}`;
  
      row.appendChild(rankCell);
      row.appendChild(nameCell);
      row.appendChild(amountCell);
      leaderboardBody.appendChild(row);
    });
  }
  
  function filterDonors(event) {
    const query = event.target.value.toLowerCase();
    const rows = document.querySelectorAll('#leaderboard tbody tr');
  
    rows.forEach(row => {
      const name = row.cells[1].textContent.toLowerCase();
      if (name.includes(query)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }
  
  function sortDonors(criteria) {
    const rows = Array.from(document.querySelectorAll('#leaderboard tbody tr'));
    let sortedRows;
  
    if (criteria === 'newest') {
      sortedRows = rows.sort((a, b) => b.dataset.timestamp - a.dataset.timestamp);
    } else if (criteria === 'oldest') {
      sortedRows = rows.sort((a, b) => a.dataset.timestamp - b.dataset.timestamp);
    } else if (criteria === 'top') {
      sortedRows = rows.sort((a, b) => parseFloat(b.cells[2].textContent.slice(1)) - parseFloat(a.cells[2].textContent.slice(1)));
    }
  
    const tbody = document.querySelector('#leaderboard tbody');
    tbody.innerHTML = '';
    sortedRows.forEach(row => tbody.appendChild(row));
  }
  