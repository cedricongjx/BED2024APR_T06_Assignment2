// Fetch events from the server and display them
//const image = require('../images/event/172')
const token = localStorage.getItem('token')
async function fetchEvents() {
    try {
      const response = await fetch('http://localhost:3000/event');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      renderEvents(data);
      document.getElementById('latestEventBanner').classList.remove('hidden');
      document.getElementById('latestEventCard').classList.remove('hidden');
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  }
  
  // Search for events based on user input
  async function searchEvent() {
    const searchQuery = document.getElementById('searchInput').value.trim();
    if (searchQuery === '') {
      document.getElementById('latestEventBanner').classList.remove('hidden');
      document.getElementById('latestEventCard').classList.remove('hidden');
      document.querySelector('.scroll-container').classList.remove('hidden');
      await fetchEvents();
      await fetchLatestEvent();
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/events/search?name=${encodeURIComponent(searchQuery)}`);
      if (response.status === 404) {
        document.getElementById('noResultsMessage').style.display = 'block';
        document.getElementById('cardContainer').innerHTML = '';
        document.getElementById('latestEventBanner').style.display = 'none';
        document.getElementById('latestEventCard').style.display = 'none';
        document.querySelector('.scroll-container').style.display = 'none';
        return;
      }
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const events = await response.json();
      renderEvents(events);
      document.getElementById('noResultsMessage').style.display = 'none';
      document.getElementById('latestEventBanner').style.display = 'none';
      document.getElementById('latestEventCard').style.display = 'none';
    } catch (error) {
      console.error('Failed to search events:', error);
    }
  }
  
  // Render event cards with images
  function renderEvents(events) {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = '';  // Clear previous events
    if (events.length === 0) {
      const noEventMessage = document.createElement('p');
      noEventMessage.textContent = 'There are no events available.';
      noEventMessage.className = 'no-events-message';
      cardContainer.appendChild(noEventMessage);
    } else {
      events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'card';
        console.log(event.Image);
        const imageURL = `/public/images/event/${event.Image}`;
        console.log('Image URL:', imageURL);
  
        card.innerHTML = `
          <img src="${imageURL}">
          <h3 class="card-name">${event.EventName}</h3>
          <p class="card-description">${event.eventDescription}</p>
          <p class="card-datetime">${new Date(event.eventDateTime).toLocaleString()}</p>
          <!-- Remove the Edit button -->
        `;
        card.addEventListener('click', () => viewEvent(event.Eventid, events));
        cardContainer.appendChild(card);
      });
    }
  }
  
  // View a specific event and store it in localStorage
  function viewEvent(eventId, events) {
    const event = events.find(e => e.Eventid === eventId);
    localStorage.setItem('selectedEvent', JSON.stringify(event));
    window.location.href = 'user_event_details.html';
  }
  
  // Fetch the latest event
  async function fetchLatestEvent() {
    try {
      const response = await fetch('/latestEvent');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const event = await response.json();
      const imageURL = `/public/images/event/${event.Image}`;
      document.getElementById('eventTitle').textContent = event.EventName;
      document.getElementById('eventDescription').textContent = event.eventDescription;
      document.getElementById('eventDateTime').textContent = new Date(event.eventDateTime).toLocaleString();
      document.getElementById('eventImage').src = imageURL;
      document.querySelector('.latest-event-card').addEventListener('click', () => viewEvent(event.Eventid, [event]));
    } catch (error) {
      console.error('Error fetching the latest event:', error);
    }
  }
  
  // Scroll events horizontally
  function scrollPrev() {
    document.getElementById('cardContainer').scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  }
  
  function scrollNext() {
    document.getElementById('cardContainer').scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  }
  
  async function fetchCategories() {
    try {
      const response = await fetch('http://localhost:3000/category');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const categories = await response.json();
      const categoryFilterContainer = document.getElementById('categoryFilterContainer');
      
      categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.categoryName;
        button.onclick = () => filterByCategory(category.catId);
        categoryFilterContainer.appendChild(button);
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
  
  async function filterByCategory(categoryId) {
    try {
      const response = await fetch(`http://localhost:3000/events/category/${categoryId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch filtered events');
      }
      const events = await response.json();
      renderEvents(events);
    } catch (error) {
      console.error('Error fetching filtered events:', error);
    }
  }
  
  async function removeCategoryFilter() {
    // Clear the filter category (optional, if you have any UI to indicate selected categories)
    document.getElementById('categoryFilterContainer').querySelectorAll('button').forEach(button => {
      button.classList.remove('active'); // Remove active class if used
    });
  
    // Fetch and display all events
    await fetchEvents();
  }
  async function fetchUserEvents(userId) {
    try {
      const response = await fetch(`http://localhost:3000/userwithevent/${userId}`);
      if (!response) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const contentType = response.headers.get("content-type");
      let userData;
  
      if (contentType && contentType.indexOf("application/json") !== -1) {
        userData = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text}`);
      }
      
      console.log('Fetched user data:', userData);  
  
      if (userData.length > 0 && userData[0].events) {
        const userEvents = userData[0].events;
        renderUserEvents(userEvents);
      } else {
        renderUserEvents([]);  // No events found
      }
    } catch (error) {
      console.error('Failed to fetch user events:', error);
    }
  }
  

  function renderUserEvents(userEvents) {
    const userEventsList = document.getElementById('userEventsList');
    userEventsList.innerHTML = '';  // Clear previous user events
  
    if (userEvents.length === 0) {
      document.getElementById('noUserEventsMessage').style.display = 'block';
    } else {
      document.getElementById('noUserEventsMessage').style.display = 'none';
  
      userEvents.forEach(event => {
        const card = document.createElement('div');
        card.className = 'card';
        console.log(event.imageURL)
        // Assuming event.Image exists, if not, remove the image or handle it accordingly
        const imageURL = event.imageURL ? `/public/images/event/${event.imageURL}` : 'https://via.placeholder.com/400x300';
        console.log(imageURL)
        card.innerHTML = `
          <img src="${imageURL}" alt="${event.eventName}">
          <h3 class="card-name">${event.eventName}</h3>
          <p class="card-description">${event.eventDescription}</p>
          <p class="card-datetime">${new Date(event.eventDateTime).toLocaleString()}</p>
        `;
        card.addEventListener('click', () => viewEvent(event.Eventid, userEvents));
        userEventsList.appendChild(card);
      });
    }
  }
  function viewEvent(eventId, events) {
    const event = events.find(e => e.Eventid === eventId);
    localStorage.setItem('selectedEvent', JSON.stringify(event));
    window.location.href = 'user_event_details.html';
  }
  // Initialize the page
  document.addEventListener('DOMContentLoaded', function() {
    fetchEvents();
    //fetchLatestEvent();
    fetchCategories();
    const userId = 1;
    fetchUserEvents(userId);
    document.getElementById('showAllButton').addEventListener('click', () => {
      fetchEvents()
    });
  });
  
  
  