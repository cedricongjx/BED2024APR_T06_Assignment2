function handleDonation(event) {
  event.preventDefault();
  const firstName = document.getElementById('firstName').value;
  let amount = document.getElementById('amount').value;

  // Remove any dollar signs and convert to a number
  amount = amount.replace(/\$/g, '');
  amount = parseFloat(amount);

  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid donation amount.');
    return;
  }

  const token = localStorage.getItem('token'); // Get the stored token

  fetch('/api/donate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Include the token in the request headers
    },
    body: JSON.stringify({ firstName, amount })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      alert('Donation failed: ' + data.error);
    } else {
      document.getElementById('confirmMessage').style.display = 'block';
      document.getElementById('confirmMessage').innerText = `Thank you for your donation of $${amount}. Your support is greatly appreciated!`;
    }
  })
  .catch(error => console.error('Error:', error));
}
