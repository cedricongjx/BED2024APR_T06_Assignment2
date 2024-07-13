// let dateTimeCount = 1;
// const admin = 1;

// function addDateTimeField() {
//   dateTimeCount++;
//   const newDateTimeDiv = document.createElement('div');
//   newDateTimeDiv.className = 'mb-3';
//   newDateTimeDiv.innerHTML = `
//     <label for="eventDateTime${dateTimeCount}" class="form-label">Event Times</label>
//     <input type="datetime-local" class="form-control" id="eventDateTime${dateTimeCount}" name="eventDateTime[]">
//     <button type="button" class="btn btn-danger" onclick="removeDateTimeField(this)">
//       <i class="fas fa-times"></i> <!-- X icon -->
//     </button>
//   `;
//   document.getElementById('dateTimeFields').appendChild(newDateTimeDiv);
// }

// function removeDateTimeField(button) {
//   const dateTimeField = button.parentNode;
//   dateTimeField.parentNode.removeChild(dateTimeField);
// }

// function logFormData(formData) {
//   for (const [key, value] of formData.entries()) {
//     if (value instanceof File) {
//       console.log(`${key}: File - ${value.name}`);
//     } else {
//       console.log(`${key}: ${value}`);
//     }
//   }
// }

// function formDataToJson(formData) {
//   const obj = {};
//   formData.forEach((value, key) => {
//     if (obj.hasOwnProperty(key)) {
//       if (Array.isArray(obj[key])) {
//         obj[key].push(value);
//       } else {
//         obj[key] = [obj[key], value];
//       }
//     } else {
//       obj[key] = value;
//     }
//   });
//   return JSON.stringify(obj, null, 2);
// }

// document.addEventListener('DOMContentLoaded', function() {
//   const submitButton = document.querySelector('.btn-submit');
//   submitButton.addEventListener('click', async function(event) {
//     event.preventDefault(); // Prevent form submission

//     const eventName = document.getElementById('eventInputName').value;
//     const eventDescription = document.getElementById('eventInputDescription').value;
//     const eventLocation = document.getElementById('eventInputlocation').value;
//     const dateTimeFields = document.querySelectorAll('input[name="eventDateTime[]"]');
    
//     // Collect all datetime values
//     const eventDateTimes = Array.from(dateTimeFields).map(field => field.value).filter(value => value);

//     // Get the file input
//     const fileInput = document.getElementById('eventInputImage');
//     const file = fileInput.files[0];
    
//     // Iterate over each datetime value
//     for (const dateTime of eventDateTimes) {
//       const formData = new FormData();
//       if (file) {
//         // Create the custom file detail string
//         const fileDetails = `${file.lastModified}-${file.name.split('.').slice(0, -1).join('.')}.${file.name.split('.').pop()}`;
//         formData.append('image', fileDetails); // Append file details
//          // Append actual file
//       }
//       formData.append('eventName', eventName);
//       formData.append('eventDescription', eventDescription);
//       formData.append('eventLocation', eventLocation);
//       formData.append('eventDateTime', dateTime); // Send one date-time at a time

//       console.log('FormData contents before sending:');
//       logFormData(formData); // Log FormData contents

//       // Convert FormData to JSON and log it for debugging
//       const jsonString = formDataToJson(formData);
//       console.log('FormData as JSON:', jsonString);

//       try {
//         const response = await fetch('http://localhost:3000/event', {
//           method: 'POST',
//           body: jsonString
//         });

//         if (!response.ok) {
//           const errorResponse = await response.text();
//           console.error('Server responded with error:', errorResponse);
//           alert(`Error: ${errorResponse}`); // Alert the error message to the user
//           return;
//         }

//         const data = await response.json();
//         console.log('Event created:', data);
//         // Optionally, you might want to handle or display each created event separately
//       } catch (error) {
//         console.error('Error processing events:', error);
//         alert(`Error: ${error.message}`); // Alert the error message to the user
//         return; // Stop further processing if an error occurs
//       }
//     }

//     // Redirect after all requests are processed
//     window.location.href = 'events.html'; 
//   });
// });
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
    const eventLocation = document.getElementById('eventInputlocation').value;
    const fileInput = document.getElementById('eventInputImage');
    const file = fileInput.files[0]; // Get the file object
    const dateTimeFields = document.querySelectorAll('input[name="eventDateTime[]"]');

    const fetchPromises = [];

    // If there is a file to upload, handle the file upload separately
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const uploadResponse = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error(`HTTP error! Status: ${uploadResponse.status}`);
        }

        const uploadData = await uploadResponse.json();
        console.log('Image uploaded:', uploadData);

        // Use the returned file information for the event data
        const fileDetails = uploadData.file.filename;

        dateTimeFields.forEach(field => {
          const date = new Date(field.value);
          if (!isNaN(date.getTime())) {
            const eventDateTime = date.toISOString();

            const eventData = {
              EventName: eventName,
              eventDescription: eventDescription,
              eventDateTime: eventDateTime,
              Adminid: 1,
              Image: fileDetails,
              location: eventLocation  
            };

            console.log(JSON.stringify(eventData));

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
            })
            .catch(error => {
              console.error('Failed to create event:', error);
            });

            fetchPromises.push(fetchPromise);
          } else {
            console.error(`Invalid date input: ${field.value}`);
          }
        });

        try {
          await Promise.all(fetchPromises);
          console.log('All events processed successfully');
          window.location.href = 'events.html';
        } catch (error) {
          console.error('Error processing events:', error);
        }
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    } else {
      // Handle the case where there is no file to upload
      dateTimeFields.forEach(field => {
        const date = new Date(field.value);
        if (!isNaN(date.getTime())) {
          const eventDateTime = date.toISOString();

          const eventData = {
            EventName: eventName,
            eventDescription: eventDescription,
            eventDateTime: eventDateTime,
            Adminid: 1,
            Image: null, // or a default value
            location: eventLocation  
          };

          console.log(JSON.stringify(eventData));

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
          })
          .catch(error => {
            console.error('Failed to create event:', error);
          });

          fetchPromises.push(fetchPromise);
        } else {
          console.error(`Invalid date input: ${field.value}`);
        }
      });

      try {
        await Promise.all(fetchPromises);
        console.log('All events processed successfully');
        window.location.href = 'events.html';
      } catch (error) {
        console.error('Error processing events:', error);
      }
    }
  });
});
