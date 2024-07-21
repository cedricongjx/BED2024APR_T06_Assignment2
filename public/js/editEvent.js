const admin = 1; // Hardcoded admin ID for demonstration

document.addEventListener('DOMContentLoaded', function() {
  const queryParams = new URLSearchParams(window.location.search);
  const eventId = queryParams.get('id');

  if (eventId) {
    fetchEventDetails(eventId);
  }

  document.getElementById('editEventForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const eventName = document.getElementById('eventName').value.trim();
    const eventDescription = document.getElementById('eventDescription').value.trim();
    const eventDateTime = document.getElementById('eventDateTime').value;
    const fileInput = document.getElementById('eventImage');
    const file = fileInput.files[0]; // Get the file object
    const eventLocation = document.getElementById('eventLocation').value.trim();

    const formData = new FormData();
    formData.append('image', file);

    let fileDetails = null;

    if (file) {
      try {
        const uploadResponse = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error(`HTTP error! Status: ${uploadResponse.status}`);
        }

        const uploadData = await uploadResponse.json();
        fileDetails = uploadData.file.filename;
        console.log('Image uploaded:', fileDetails);
      } catch (error) {
        console.error('Failed to upload image:', error);
        return; // Exit the function if image upload fails
      }
    }

    try {
      const response = await fetch(`http://localhost:3000/event/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          EventName: eventName,
          eventDescription: eventDescription,
          eventDateTime: eventDateTime,
          Image: fileDetails || document.getElementById('currentImage').src, // Use existing image if no new file is provided
          Location: eventLocation,
          Adminid: admin
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      alert('Event updated successfully!');
      window.location.href = 'events.html';
    } catch (error) {
      console.error('Error updating event:', error);
    }
  });
});

async function fetchEventDetails(eventId) {
  try {
    const response = await fetch(`http://localhost:3000/event/${eventId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event details');
    }

    const event = await response.json();
    document.getElementById('eventName').value = event.EventName;
    document.getElementById('eventDescription').value = event.eventDescription;
    document.getElementById('eventDateTime').value = new Date(event.eventDateTime).toISOString().slice(0, 16);
    document.getElementById('currentImage').src = event.Image; // Assuming you have an <img> element with id="currentImage"
    document.getElementById('eventLocation').value = event.Location || '';  // Handle missing location
  } catch (error) {
    console.error('Error fetching event details:', error);
  }
}
