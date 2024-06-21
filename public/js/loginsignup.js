function toggleAuthForms() {
  const signupBox = document.querySelector('.auth-box');
  const loginBox = document.getElementById('loginBox');

  if (signupBox.style.display === 'none') {
    signupBox.style.display = 'block';
    loginBox.style.display = 'none';
  } else {
    signupBox.style.display = 'none';
    loginBox.style.display = 'block';
  }
}

function handleSignup(event) {
  event.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  fetch('/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      alert('Signup failed: ' + data.error);
    } else {
      alert('Signup successful');
    }
  })
  .catch(error => console.error('Error:', error));
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'Login successful') {
      // Store the token or any other session identifier
      // localStorage.setItem('token', data.token); // Uncomment if using JWT
      alert('Login successful');
      window.location.href = '/donation.html'; // Redirect to donation page
    } else {
      alert('Login failed: ' + data.error);
    }
  })
  .catch(error => console.error('Error:', error));
}
