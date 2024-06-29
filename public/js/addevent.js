let dateTimeCount = 1;
const admin = 1;

function addDateTimeField() {
  dateTimeCount++;
  const newDateTimeDiv = document.createElement('div');
  newDateTimeDiv.className = 'mb-3';
  newDateTimeDiv.innerHTML = `
    <label for="eventDateTime${dateTimeCount}" class="form-label">Event Times</label>
    <input type="datetime-local" class="form-control" id="eventDateTime${dateTimeCount}" name="eventDateTime[]">
    <button type="button" class="btn btn-danger" onclick="removeDateTimeField(this)">
      <i class="fas fa-times"></i> <!-- X icon -->
    </button>
  `;
  document.getElementById('dateTimeFields').appendChild(newDateTimeDiv);
}

function removeDateTimeField(button) {
  const dateTimeField = button.parentNode;
  dateTimeField.parentNode.removeChild(dateTimeField);
}

document.addEventListener('DOMContentLoaded', function() {
  const submitButton = document.querySelector('.btn-submit');
  submitButton.addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent form submission

    const eventName = document.getElementById('eventInputName').value;
    const eventDescription = document.getElementById('eventInputDescription').value;
    const dateTimeFields = document.querySelectorAll('input[name="eventDateTime[]"]');

    // Create an array to collect all fetch promises
    const fetchPromises = [];

    dateTimeFields.forEach(field => {
      const date = new Date(field.value);
      if (!isNaN(date.getTime())) {
        const eventDateTime = date.toISOString();

        const eventData = {
          Eventname: eventName,
          eventDescription: eventDescription,
          eventDateTime: eventDateTime,
          Adminid: 1 // Replace with actual Adminid
        };

        // Create fetch promise for each event data
        const fetchPromise = fetch('http://localhost:3000/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventData)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Event created:', data);
          // Optionally handle successful response here
        })
        .catch(error => {
          console.error('Failed to create event:', error);
          // Handle error if needed
        });

        fetchPromises.push(fetchPromise);
      } else {
        console.error(`Invalid date input: ${field.value}`);
        // Handle invalid date input if needed
      }
    });

    try {
      // Wait for all fetch requests to complete
      await Promise.all(fetchPromises);
      console.log('All events processed successfully');
      // Redirect or show success message after successful submission
      window.location.href = 'events.html';
    } catch (error) {
      console.error('Error processing events:', error);
      // Handle error if needed
    }
  });
});


