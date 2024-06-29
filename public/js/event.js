async function fetchEvents() {
  try {
    const response = await fetch('http://localhost:3000/event');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    renderEvents(data);
    document.getElementById('latestEventBanner').style.display = 'block';
    document.getElementById('latest-Event-Card').style.display = 'block';
  } catch (error) {
    console.error('Failed to fetch events:', error);
  }
}
async function searchEvent() {
  const searchQuery = document.getElementById('searchInput').value;
  try {
      const response = await fetch(`http://localhost:3000/events/search?name=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const events = await response.json();
      renderEvents(events);
      document.getElementById('latestEventBanner').style.display = 'none';
      document.getElementById('latestEventCard').style.display = 'none';

  } catch (error) {
      console.error('Failed to search events:', error);
  }
}


function renderEvents(events) {
  const cardContainer = document.getElementById('cardContainer');
  cardContainer.innerHTML = '';  // Clear previous events

  events.forEach(event => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${event.img || 'https://via.placeholder.com/150'}" alt="Card Image" class="card-img">
      <div class="card-content">
        <h2 class="card-title">${event.EventName}</h2>
        <p class="card-description">${event.eventDescription}</p>
        <p class="card-datetime">${new Date(event.eventDateTime).toLocaleString()}</p>
      </div>
    `;
    card.addEventListener('click', () => viewEvent(event.Eventid, events));
    cardContainer.appendChild(card);
  });
}

function viewEvent(eventId, events) {
  const event = events.find(e => e.Eventid === eventId);
  localStorage.setItem('selectedEvent', JSON.stringify(event));
  window.location.href = 'event-details.html';
}

document.addEventListener('DOMContentLoaded', function() {
  fetchEvents();
  fetchLatestEvent();
});

async function fetchLatestEvent() {
  try {
    const response = await fetch('/latestEvent');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const event = await response.json();
    const latestEventCard = document.querySelector('.latest-event-card');
    latestEventCard.querySelector('#eventTitle').textContent = event.EventName;
    latestEventCard.querySelector('#eventDescription').textContent = event.eventDescription;
    latestEventCard.querySelector('#eventDateTime').textContent = new Date(event.eventDateTime).toLocaleString();
    latestEventCard.addEventListener('click', () => viewEvent(event.Eventid, [event])); // Make the latest event card clickable
  } catch (error) {
    console.error('Error fetching the latest event:', error);
  }
}

// document.addEventListener('DOMContentLoaded', fetchLatestEvent);

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
