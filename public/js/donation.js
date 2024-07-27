document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in to access the donation page.');
    window.location.href = 'loginsignup.html';
  } else {
    document.getElementById('donationContainer').style.display = 'block';
  }
});

function handleDonation(event) {
  event.preventDefault();
  const firstName = document.getElementById('firstName').value;
  let amount = document.getElementById('amount').value;
  const donationType = document.getElementById('donationType').value;
  const months = donationType === 'monthly' ? document.getElementById('months').value : null;

  amount = amount.replace(/\$/g, '');
  amount = parseFloat(amount);

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid donation amount.');
    return;
  }

  if (donationType === 'monthly' && (!months || isNaN(parseInt(months)) || parseInt(months) <= 0)) {
    alert('Please enter a valid number of months for monthly donation.');
    return;
  }

  const token = localStorage.getItem('token');

  fetch('/api/donate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ firstName, amount, donationType, months })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      alert('Donation failed: ' + data.error);
    } else {
      const totalAmount = donationType === 'monthly' ? amount * months : amount;
      document.getElementById('confirmMessage').style.display = 'block';
      document.getElementById('confirmMessage').innerText = `Thank you for your ${donationType} donation of $${totalAmount}. Your support is greatly appreciated!`;
    }
  })
  .catch(error => console.error('Error:', error));
}

function toggleMonthsField() {
  const donationType = document.getElementById('donationType').value;
  const monthsField = document.getElementById('months');
  if (donationType === 'monthly') {
    monthsField.style.display = 'block';
  } else {
    monthsField.style.display = 'none';
  }
}
