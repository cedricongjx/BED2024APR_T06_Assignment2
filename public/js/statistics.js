document.addEventListener('DOMContentLoaded', function() {
    fetchStatistics('weekly');
  });
  
  function fetchStatistics(period) {
    fetch(`/api/statistics?period=${period}`)
      .then(response => response.json())
      .then(data => {
        displayStatistics(data);
        renderChart(data);
      })
      .catch(error => console.error('Error fetching statistics:', error));
  }
  
  function displayStatistics(data) {
    const statisticsContainer = document.getElementById('statistics');
    statisticsContainer.innerHTML = '';
  
    data.forEach(stat => {
      const card = document.createElement('div');
      card.className = 'statistic-card';
  
      const title = document.createElement('h3');
      title.textContent = `${stat.donationType} Donations`;
  
      const amount = document.createElement('p');
      amount.textContent = `Total Amount: $${stat.totalAmount.toFixed(2)}`;
  
      card.appendChild(title);
      card.appendChild(amount);
      statisticsContainer.appendChild(card);
    });
  }
  
  function renderChart(data) {
    const ctx = document.getElementById('donationChart').getContext('2d');
    const labels = data.map(stat => stat.donationType);
    const amounts = data.map(stat => stat.totalAmount);
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Donation Amount',
          data: amounts,
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)'
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
  