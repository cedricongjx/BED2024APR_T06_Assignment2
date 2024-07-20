document.addEventListener('DOMContentLoaded', function() {
  fetchStatistics();
  fetchAverageDonations();
});

function applyFilters() {
  const month = document.getElementById('monthFilter').value;
  console.log(`Applying filters for month: ${month}`); // Debug line

  fetchStatistics(month);
  fetchAverageDonations(month);
}

function fetchStatistics(month = 'all') {
  let url = '/api/statistics';
  if (month !== 'all') {
    url += `?month=${month}`;
  }
  console.log(`Fetching statistics from URL: ${url}`); // Debug line
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log('Statistics data:', data); // Debug line
      const validData = data.filter(stat => stat.DonationType);
      displayStatistics(validData);
      renderTotalDonationsChart(validData);
    })
    .catch(error => console.error('Error fetching statistics:', error));
}

function fetchAverageDonations(month = 'all') {
  let url = '/api/average-donations';
  if (month !== 'all') {
    url += `?month=${month}`;
  }
  console.log(`Fetching average donations from URL: ${url}`); // Debug line
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log('Average donations data:', data); // Debug line
      const validData = data.filter(stat => stat.DonationType);
      renderAverageDonationsChart(validData);
    })
    .catch(error => console.error('Error fetching average donations:', error));
}

function displayStatistics(data) {
  const statisticsContainer = document.getElementById('statistics');
  statisticsContainer.innerHTML = '';

  data.forEach(stat => {
    const card = document.createElement('div');
    card.className = 'statistic-card';

    const title = document.createElement('h3');
    title.textContent = `${stat.DonationType} Donations`;

    const amount = document.createElement('p');
    amount.textContent = `Total Amount: $${stat.TotalAmount.toFixed(2)}`;

    card.appendChild(title);
    card.appendChild(amount);
    statisticsContainer.appendChild(card);
  });
}

let totalDonationsChart;
let averageDonationsChart;

function renderTotalDonationsChart(data) {
  const ctx = document.getElementById('totalDonationsChart').getContext('2d');
  const labels = data.map(stat => stat.DonationType);
  const amounts = data.map(stat => stat.TotalAmount);

  if (totalDonationsChart) {
    totalDonationsChart.destroy();
  }

  totalDonationsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Donation Amount',
        data: amounts,
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function renderAverageDonationsChart(data) {
  const ctx = document.getElementById('averageDonationsChart').getContext('2d');
  const labels = data.map(stat => stat.DonationType);
  const amounts = data.map(stat => stat.AverageAmount);

  if (averageDonationsChart) {
    averageDonationsChart.destroy();
  }

  averageDonationsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Average Donation Amount',
        data: amounts,
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
