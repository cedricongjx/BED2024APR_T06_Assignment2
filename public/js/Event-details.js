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
  
        // Fetch registered users
        try {
            const userResponse = await fetch(`http://localhost:3000/testgetalluserforevent/${event.Eventid}`);
            if (!userResponse.ok) {
                throw new Error('Failed to fetch event users');
            }
            const users = await userResponse.json();
            
            const userList = document.getElementById('userList');
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user.username;
                userList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
  
    } else {
        alert('No event selected');
        window.location.href = 'index.html';
    }
  });
  