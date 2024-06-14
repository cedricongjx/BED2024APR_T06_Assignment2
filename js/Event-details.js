document.addEventListener('DOMContentLoaded', function () {
    const event = JSON.parse(localStorage.getItem('selectedEvent'));

    if (event) {
      document.getElementById('eventImg').src = event.img;
      document.getElementById('eventTitle').innerText = event.name;
      document.getElementById('eventDescription').innerText = event.description;
      document.getElementById('eventDateTime').innerText = new Date(event.datetime).toLocaleString();
    } else {
      alert('No event selected');
      window.location.href = 'index.html';
    }
  });