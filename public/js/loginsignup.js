// Toggle between signup and login forms
function toggleAuthForms() {
  const signupBox = document.querySelector('.auth-box');
  const loginBox = document.getElementById('loginBox');

  // Check current display status and toggle
  if (signupBox.style.display === 'none') {
    signupBox.style.display = 'block';
    loginBox.style.display = 'none';
  } else {
    signupBox.style.display = 'none';
    loginBox.style.display = 'block';
  }
}

// Handle signup form submission
function handleSignup(event) {
  event.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  // Send signup request to server
  fetch('/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    // Show appropriate message based on response
    if (data.error) {
      alert('Signup failed: ' + data.error);
    } else {
      alert('Signup successful');
    }
  })
  .catch(error => console.error('Error:', error));
}


// Handle login form submission
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  // Send login request to server
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    // Show appropriate message based on response
    if (data.message === 'Login successful') {
      localStorage.setItem('token', data.token); // Store the token


      localStorage.setItem("userid", data.user_id);

      alert('Login successful');
      // window.location.href = '/donation.html'; // Redirect to donation page
      window.location.href = "/index.html"; 

//       localStorage.setItem("userid", data.userid);
      
      // Decode the token to get user information
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      
      if (payload.role === 'A') {
        // Redirect to admin user management page if role is 'A'
        window.location.href = "/adminUsers.html";
      } else {
        // Redirect to a different page if not an admin
        window.location.href = "/index.html"; 
      }

    } else {
      alert('Login failed: ' + data.error);
    }
  })
  .catch(error => console.error('Error:', error));
}
