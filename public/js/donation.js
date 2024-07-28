document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('donationForm').addEventListener('submit', handleDonation);
});
 
function handleDonation(event) {
  event.preventDefault();
 
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please sign up or log in before you can donate.');
    window.location.href = '/loginsignup.html'; // Redirect to login page
    return;
  }
 
  const firstName = document.getElementById('firstName').value;
  let amount = document.getElementById('amount').value;
  const donationType = document.getElementById('donationType').value;
  const months = donationType === 'monthly' ? document.getElementById('months').value : null;
 
  // Remove any dollar signs and convert to a number
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
 
  console.log("Sending donation request:", { firstName, amount, donationType, months });
 
  fetch('/api/donate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Include the token in the request headers
    },
    body: JSON.stringify({ firstName, amount, donationType, months })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Donation response:", data);
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
    monthsField.style.display = 'block'; // Show the months field for monthly donations
  } else {
    monthsField.style.display = 'none'; // Hide the months field for one-time donations
  }
}
 