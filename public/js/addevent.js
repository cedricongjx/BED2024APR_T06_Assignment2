let categories = [];
let dateTimeCount = 1;
const token = localStorage.getItem("token")
function addDateTimeField() {
  dateTimeCount++;
  const newDateTimeDiv = document.createElement('div');
  newDateTimeDiv.className = 'mb-3';
  newDateTimeDiv.innerHTML = `
            <div id="dateTimeFields" class="mb-3">
              <label for="eventDateTime1" class="form-label">Event Times</label>
              <input type="datetime-local" class="form-control" id="eventDateTime1" name="eventDateTime[]" style="margin-bottom: 1rem; padding: 0.75rem; font-size: 1rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
              <button type="button" class="btn btn-danger" style="margin-left: 10px;" onclick="removeDateTimeField(this)">
          <i class="fas fa-times"></i>
        </button>
            </div>
            `;
  document.getElementById('dateTimeFields').appendChild(newDateTimeDiv);
}

function removeDateTimeField(button) {
  const dateTimeField = button.parentNode;
  dateTimeField.parentNode.removeChild(dateTimeField);
}

document.addEventListener('DOMContentLoaded', function() {
  fetchExistingCategories();

  const submitButton = document.querySelector('.btn-submit');
  submitButton.addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent form submission

    const eventName = document.getElementById('eventInputName').value;
    const eventDescription = document.getElementById('eventInputDescription').value;
    const eventLocation = document.getElementById('eventInputlocation').value;
    const fileInput = document.getElementById('eventInputImage');
    const file = fileInput.files[0]; // Get the file object
    const dateTimeFields = document.querySelectorAll('input[name="eventDateTime[]"]');
    const selectedCategories = Array.from(document.querySelectorAll('input[name="categories"]:checked')).map(input => input.value);

    const fetchPromises = [];
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

        const fileDetails = uploadData.file.filename;

        for (const field of dateTimeFields) {
          const date = new Date(field.value);
          if (!isNaN(date.getTime())) {
            const eventDateTime = date.toISOString();

            const eventData = {
              EventName: eventName,
              eventDescription: eventDescription,
              eventDateTime: eventDateTime,
              Image: fileDetails,
              location: eventLocation  
            };

            console.log(JSON.stringify(eventData));

            const fetchPromise = fetch('http://localhost:3000/eventpost', {
              method: 'POST',
              headers: {
                'Authorization' : `Bearer ${token}`,
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
            .then(async data => {
              console.log('Event created:', data);
              const eventId = data.Eventid;

              const categoryPromises = selectedCategories.map(catId => {
                return fetch('http://localhost:3000/addcategoryforevent', {
                  method: 'POST',
                  headers: {
                    'Authorization' : `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ eventid: eventId, catid: catId })
                });
              });

              await Promise.all(categoryPromises);
            })
            .catch(error => {
              console.error('Failed to create event:', error);
            });

            fetchPromises.push(fetchPromise);
          } else {
            console.error(`Invalid date input: ${field.value}`);
          }
        }

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
      for (const field of dateTimeFields) {
        const date = new Date(field.value);
        if (!isNaN(date.getTime())) {
          const eventDateTime = date.toISOString();

          const eventData = {
            EventName: eventName,
            eventDescription: eventDescription,
            eventDateTime: eventDateTime,
            Image: null, // or a default value
            location: eventLocation  
          };

          console.log(JSON.stringify(eventData));

          const fetchPromise = fetch('http://localhost:3000/eventpost', {
            method: 'POST',
            headers: {
              'Authorization' : `Bearer ${token}`,
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
          .then(async data => {
            console.log('Event created:', data);
            const eventId = data.Eventid;

            const categoryPromises = selectedCategories.map(catId => {
              return fetch('http://localhost:3000/addcategoryforevent', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ eventid: eventId, catid: catId })
              });
            });

            await Promise.all(categoryPromises);
          })
          .catch(error => {
            console.error('Failed to create event:', error);
          });

          fetchPromises.push(fetchPromise);
        } else {
          console.error(`Invalid date input: ${field.value}`);
        }
      }

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

async function addCategory() {
  const categoryInput = document.getElementById('categoryInput');
  const categoryName = categoryInput.value.trim();

  if (categoryName) {
    try {
      const response = await fetch('http://localhost:3000/categorypost', {
        method: 'POST',
        headers: {
          'Authorization' : `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoryName: categoryName })
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      const newCategory = await response.json();
      categories.push(newCategory);
      renderExistingCategories(categories);
      categoryInput.value = '';
    } catch (error) {
      console.error('Error adding category:', error);
    }
  }
}

function renderExistingCategories(categories) {
  const existingCategoriesContainer = document.getElementById('existingCategories');
  existingCategoriesContainer.innerHTML = '';
  categories.forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'form-check d-flex align-items-center';
    categoryDiv.innerHTML = `
      <input class="form-check-input me-2" type="checkbox" name="categories" value="${category.catId}" id="category${category.catId}">
      <label class="form-check-label flex-grow-1" for="category${category.catId}">
        ${category.categoryName}
      </label>
      <button type="button" class="btn btn-danger btn-sm ms-2" onclick="deleteCategory(${category.catId})">
        Delete
      </button>
    `;
    existingCategoriesContainer.appendChild(categoryDiv);
  });
}

async function fetchExistingCategories() {
  try {
    const response = await fetch('http://localhost:3000/category');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    categories = await response.json();
    renderExistingCategories(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

async function deleteCategory(categoryId) {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      const response = await fetch(`http://localhost:3000/categorydelete/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      categories = categories.filter(category => category.catId !== categoryId);
      renderExistingCategories(categories);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }
}


