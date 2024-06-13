// event.js

document.addEventListener('DOMContentLoaded', function () {
  const events = JSON.parse(localStorage.getItem('events')) || [
    { id: 1, name: 'Event 1', description: 'This is a description of event 1.', img: 'https://via.placeholder.com/150', datetime: '2024-07-10T10:00' },
    { id: 2, name: 'Event 2', description: 'This is a description of event 2.', img: 'https://via.placeholder.com/150', datetime: '2024-07-15T09:00' },
    { id: 3, name: 'Event 3', description: 'This is a description of event 3.', img: 'https://via.placeholder.com/150', datetime: '2024-07-15T09:00' },
    { id: 4, name: 'Event 4', description: 'This is a description of event 4.', img: 'https://via.placeholder.com/150', datetime: '2024-07-15T09:00' },
    { id: 5, name: 'Event 5', description: 'This is a description of event 5.', img: 'https://via.placeholder.com/150', datetime: '2024-07-15T09:00' },
    { id: 6, name: 'Event 6', description: 'This is a description of event 6.', img: 'https://via.placeholder.com/150', datetime: '2024-07-15T09:00' },
    { id: 7, name: 'Event 7', description: 'This is a description of event 7.', img: 'https://via.placeholder.com/150', datetime: '2024-07-15T09:00' },
    { id: 8, name: 'Event 8', description: 'This is a description of event 8.', img: 'https://via.placeholder.com/150', datetime: '2024-07-15T09:00' },
    { id: 9, name: 'Event 9', description: 'This is a description of event 9.', img: 'https://via.placeholder.com/150', datetime: '2024-07-15T09:00' },
    { id: 10, name: 'Event 10', description: 'This is a description of event 10.', img: 'https://via.placeholder.com/150', datetime: '2024-07-15T09:00' },
    // Add more default events as needed
  ];

  const cardContainer = document.getElementById('cardContainer');

  events.forEach(event => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${event.img}" alt="Card Image" class="card-img">
      <div class="card-content">
        <h2 class="card-title">${event.name}</h2>
        <p class="card-description">${event.description}</p>
      </div>
    `;
    card.addEventListener('click', () => viewEvent(event.id));
    cardContainer.appendChild(card);
  });

  function viewEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    localStorage.setItem('selectedEvent', JSON.stringify(event));
    window.location.href = 'Event-details.html';
  }
});

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
