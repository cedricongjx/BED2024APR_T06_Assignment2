const userid = 6; 

document.addEventListener('DOMContentLoaded', async function () {
    const event = JSON.parse(localStorage.getItem('selectedEvent'));

    if (event) {
        const imageURL = `/public/images/event/${event.Image}`;
        document.getElementById('eventImg').src = imageURL;
        document.getElementById('eventTitle').innerText = event.EventName;
        document.getElementById('eventDescription').innerText = event.eventDescription;
        document.getElementById('eventDateTime').innerText = new Date(event.eventDateTime).toLocaleString();
        document.getElementById('eventLocation').innerText = event.location;

        // Fetch event categories
        try {
            const response = await fetch(`/eventWithCategory/${event.Eventid}`);
            if (!response.ok) {
                throw new Error('Failed to fetch event categories');
            }
            const eventDetails = await response.json();

            const categoryList = document.getElementById('categoryList');
            eventDetails.categories.forEach(category => {
                const li = document.createElement('li');
                li.textContent = category.categoryName;
                categoryList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
        // Fetch event users
        try {
            const userResponse = await fetch(`http://localhost:3000/testgetalluserforevent/${event.Eventid}`);
            if (!userResponse.ok) {
                throw new Error('Failed to fetch event users');
            }
            const users = await userResponse.json();

            const userList = document.getElementById('userList');
            userList.innerHTML = ''; // Clear existing user list
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user.username;
                userList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
        // Check initial registration status and update button visibility
        await updateButtonVisibility(event.Eventid, userid);
        // Register user
        document.getElementById('registerButton').addEventListener('click', async function () {
            try {
                const registeredResponse = await fetch("http://localhost:3000/testadduser", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        eventid: event.Eventid,
                        userid: userid // Use the current user ID
                    })
                });
                if (!registeredResponse.ok) {
                    throw new Error('Failed to register user for event');
                } else {
                    alert('User registered successfully');
                    await updateUserList();
                    await updateButtonVisibility(event.Eventid, userid); // Recheck button visibility
                }
            } catch (error) {
                console.error('Error registering user:', error);
            }
        });
        // Remove user
        document.getElementById('removeButton').addEventListener('click', async function () {
            try {
                const removedResponse = await fetch("http://localhost:3000/testremoveuser", {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        eventid: event.Eventid,
                        userid: userid // Use the current user ID
                    })
                });
                if (!removedResponse.ok) {
                    throw new Error('Failed to remove user from event');
                } else {
                    alert('User removed successfully');
                    await updateUserList();
                    await updateButtonVisibility(event.Eventid, userid); // Recheck button visibility
                }
            } catch (error) {
                console.error('Error removing user:', error);
            }
        });
        // Function to update user list
        async function updateUserList() {
            const userList = document.getElementById('userList');
            userList.innerHTML = '';
            try {
                const userResponse = await fetch(`http://localhost:3000/testgetalluserforevent/${event.Eventid}`);
                if (!userResponse.ok) {
                    throw new Error('Failed to fetch event users');
                }
                const users = await userResponse.json();

                const userList = document.getElementById('userList');
                //userList.innerHTML = ''; // Clear existing user list
                users.forEach(user => {
                    const li = document.createElement('li');
                    li.textContent = user.username;
                    userList.appendChild(li);
                });
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        // Function to update button visibility
        async function updateButtonVisibility(eventId, userId) {
            try {
                const checkResponse = await fetch(`http://localhost:3000/testcheck`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        eventid: eventId,
                        userid: userId
                    })
                });

                if (!checkResponse) {
                    throw new Error('Failed to check user registration');
                }
                const { message } = await checkResponse.json();
                if (message === "User is registered for the event") {
                    document.getElementById('registerButton').style.display = 'none';
                    document.getElementById('removeButton').style.display = 'block';
                } else {
                    document.getElementById('registerButton').style.display = 'block';
                    document.getElementById('removeButton').style.display = 'none';
                }
            } catch (error) {
                console.error('Error checking registration status:', error);
            }
        }
    } else {
        alert('No event selected');
        window.location.href = 'index.html';
    }
});
