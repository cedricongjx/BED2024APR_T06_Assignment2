let selectedAmount = 0;
let selectedMonths = 0;

function selectAmount(amount) {
  selectedAmount = amount;
  document.querySelectorAll('.amount .button').forEach(button => button.classList.remove('selected'));
  document.querySelectorAll('.amount .button')[amount / 30 - 1].classList.add('selected');
  document.getElementById('customAmount').value = '';
}

function selectCustomAmount() {
  document.querySelectorAll('.amount .button').forEach(button => button.classList.remove('selected'));
  selectedAmount = document.getElementById('customAmount').value;
}

function selectMonths(months) {
  selectedMonths = months;
  document.querySelectorAll('.monthly-options .amount .button').forEach(button => button.classList.remove('selected'));
  document.querySelectorAll('.monthly-options .amount .button')[months / 3 - 1].classList.add('selected');
}

function toggleMonthly(show) {
  const monthlyOptions = document.getElementById('monthlyOptions');
  if (show) {
    monthlyOptions.style.display = 'flex';
  } else {
    monthlyOptions.style.display = 'none';
  }
}

function donate() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const donationType = document.querySelector('input[name="donationType"]:checked').value;
  const emailReceipt = document.getElementById('receipt').checked;

  // Here you would typically send the donation data to the server
  console.log({
    firstName,
    lastName,
    email,
    selectedAmount,
    selectedMonths,
    donationType,
    emailReceipt
  });

  document.getElementById('confirmMessage').style.display = 'block';
  document.getElementById('confirmMessage').innerText = `Thank you for your donation of $${selectedAmount}. Your support is greatly appreciated!`;
}
