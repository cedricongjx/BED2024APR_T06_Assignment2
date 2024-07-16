document.addEventListener('DOMContentLoaded', function() {
  fetchTopDonors('one-time');
  document.getElementById('searchDonor').addEventListener('input', filterDonors);
});

let currentDonationType = 'one-time';

function toggleDonationType() {
  currentDonationType = currentDonationType === 'one-time' ? 'monthly' : 'one-time';
  const title = currentDonationType === 'one-time' ? 'Top Donors by One-Time Donation' : 'Top Donors by Monthly Donation';
  document.getElementById('leaderboard-title').innerText = title;
  fetchTopDonors(currentDonationType);
}

function fetchTopDonors(donationType) {
  fetch(`/api/top-donors?type=${donationType}`)
    .then(response => response.json())
    .then(data => {
      displayTopDonors(data);
      displayLeaderboard(data);
    })
    .catch(error => console.error('Error fetching top donors:', error));
}

function displayTopDonors(data) {
  const topDonors = data.slice(0, 3); // Get top 3 donors
  const topDonorsContainer = document.getElementById('topDonors');
  topDonorsContainer.innerHTML = '';

  topDonors.forEach(donor => {
    const card = document.createElement('div');
    card.className = 'top-donor-card';

    const img = document.createElement('img');
    img.src = `images/avatar-placeholder.png`; // Placeholder image, replace with actual avatar

    const name = document.createElement('h3');
    name.textContent = donor.Name;

    const amount = document.createElement('p');
    amount.textContent = `$${donor.TotalAmount.toFixed(2)}`;

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
    nameCell.textContent = donor.Name;
    amountCell.textContent = `$${donor.TotalAmount.toFixed(2)}`;

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
