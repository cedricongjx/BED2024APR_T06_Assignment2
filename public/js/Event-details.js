document.addEventListener('DOMContentLoaded', function () {
  const event = JSON.parse(localStorage.getItem('selectedEvent'));

  if (event) {
    // Use the local folder path directly if 'img' or 'image' property is available
    const imageURL = `/public/images/event/${event.Image}`;
    document.getElementById('eventImg').src = imageURL;
    document.getElementById('eventTitle').innerText = event.EventName;
    document.getElementById('eventDescription').innerText = event.eventDescription;
    document.getElementById('eventDateTime').innerText = new Date(event.eventDateTime).toLocaleString();
  } else {
    alert('No event selected');
    window.location.href = 'index.html';
  }
});
