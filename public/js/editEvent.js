document.addEventListener('DOMContentLoaded', async function() {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id');
    if (!eventId) {
      alert('No event ID found');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/event/${eventId}`);
      if (!response.ok) {
        throw new Error('Error fetching event');
      }
      const event = await response.json();
      document.getElementById('eventName').value = event.EventName;
      document.getElementById('eventDescription').value = event.eventDescription;
      document.getElementById('eventDateTime').value = new Date(event.eventDateTime).toISOString().slice(0, 16);
    } catch (error) {
      console.error('Failed to fetch event:', error);
    }
  });
  
  document.getElementById('editEventForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('id');
  
    const eventName = document.getElementById('eventName').value;
    const eventDescription = document.getElementById('eventDescription').value;
    const eventDateTime = document.getElementById('eventDateTime').value;
  
    const updatedEvent = {
      EventName: eventName,
      eventDescription: eventDescription,
      eventDateTime: eventDateTime,
      Adminid : 1
    };
    console.log('Updated Event Data:', updatedEvent);
    console.log('ID is',eventId)
    try {
      const response = await fetch(`http://localhost:3000/event/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEvent)
      });
  
      if (!response.ok) {
        throw new Error('Error updating event');
      }
  
      const result = await response.json();
      console.log('Event updated:', result);
      // Optionally, redirect or update the UI accordingly
    } catch (error) {
      console.error('Failed to update event:', error);
      console.log('Failed to update event:', error);
    }
  });
  