document.addEventListener('DOMContentLoaded', function () {
    const event = JSON.parse(localStorage.getItem('selectedEvent'));

    if (event) {
      document.getElementById('eventImg').src = event.img || 'https://via.placeholder.com/150';
      document.getElementById('eventTitle').innerText = event.EventName;
      document.getElementById('eventDescription').innerText = event.eventDescription;
      document.getElementById('eventDateTime').innerText = new Date(event.eventDateTime).toLocaleString();
    } else {
      alert('No event selected');
      window.location.href = 'index.html';
    }
  });