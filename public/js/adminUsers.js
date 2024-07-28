document.addEventListener('DOMContentLoaded', () => {
  checkAdminRole();
});

function checkAdminRole() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Access Denied: Please login as an admin.');
    window.location.href = '/loginsignup.html'; // Redirect to login page
    return;
  }

  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token payload:', payload); // Log the token payload
  if (payload.role !== 'A') {
    alert('Access Denied: Admins only.');
    window.location.href = '/loginsignup.html'; // Redirect to login page
    return;
  }

  fetchAllUsers();
}

function fetchAllUsers() {
  const token = localStorage.getItem('token');
  console.log('Fetching all users with token:', token); // Log the token
  fetch('/api/users', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(users => {
    console.log('Fetched users:', users); // Log the fetched users
    const usersTable = document.querySelector('#usersTable tbody');
    usersTable.innerHTML = '';
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.Userid}</td>
        <td>${user.username}</td>
        <td>
          <button onclick="deleteUser(${user.Userid})">Delete</button>
        </td>
      `;
      usersTable.appendChild(row);
    });
  })
  .catch(error => console.error('Error fetching users:', error));
}

function getUserByIdForm(event) {
  event.preventDefault();
  const userId = document.getElementById('userId').value;
  console.log('Fetching user with ID:', userId); // Log the user ID
  getUserById(userId);
}

function getUserById(userId) {
  const token = localStorage.getItem('token');
  fetch(`/api/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(user => {
    console.log('Fetched user:', user); // Log the fetched user
    const userDetails = document.getElementById('userDetails');
    userDetails.innerHTML = `
      <p>ID: ${user.Userid}</p>
      <p>Username: ${user.username}</p>
    `;
  })
  .catch(error => console.error('Error fetching user:', error));
}

function updateUser(event) {
  event.preventDefault();
  const userId = document.getElementById('updateUserId').value;
  const username = document.getElementById('updateUsername').value;
  const password = document.getElementById('updatePassword').value;
  const token = localStorage.getItem('token');
  console.log('Updating user with ID:', userId, 'with token:', token); // Log the update details
  fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(() => {
    alert('User updated successfully');
    fetchAllUsers();
  })
  .catch(error => console.error('Error updating user:', error));
}

function deleteUser(userId) {
  const token = localStorage.getItem('token');
  console.log('Deleting user with ID:', userId, 'with token:', token); // Log the delete details
  fetch(`/api/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    alert('User deleted successfully');
    fetchAllUsers();
  })
  .catch(error => console.error('Error deleting user:', error));
}
