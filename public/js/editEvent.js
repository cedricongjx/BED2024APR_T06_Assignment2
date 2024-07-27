document.addEventListener('DOMContentLoaded', function() {
  const queryParams = new URLSearchParams(window.location.search);
  const eventId = queryParams.get('id');

  if (eventId) {
    fetchEventDetails(eventId);
  }
  fetchExistingCategories();

  document.getElementById('eventForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const eventName = document.getElementById('eventInputName').value.trim();
    const eventDescription = document.getElementById('eventInputDescription').value.trim();
    const eventDateTime = document.getElementById('eventDateTime1').value;
    const fileInput = document.getElementById('eventInputImage');
    const file = fileInput.files[0]; // Get the file object
    const eventLocation = document.getElementById('eventInputlocation').value.trim();
    const selectedCategories = Array.from(document.querySelectorAll('input[name="categories"]:checked')).map(input => input.value);

    let fileDetails = null;

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
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      await deleteAllCategoriesForEvent(eventId);

      // Update categories
      await Promise.all(selectedCategories.map(catId => {
        return fetch('http://localhost:3000/addcategoryforevent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ eventid: eventId, catid: catId })
        });
      }));

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
    console.log('Fetched event:', event);
    document.getElementById('eventInputName').value = event.EventName;
    document.getElementById('eventInputDescription').value = event.eventDescription;
    document.getElementById('eventDateTime1').value = new Date(event.eventDateTime).toISOString().slice(0, 16);
    //document.getElementById('currentImage').src = event.Image; // Ensure an <img> element with id="currentImage" exists
    document.getElementById('eventInputlocation').value = event.location;  // Handle missing location
    
    // Fetch and populate categories
    const selectedCategories = event.categories || [];
    fetchExistingCategories(selectedCategories);
  } catch (error) {
    console.error('Error fetching event details:', error);
  }
}

async function fetchExistingCategories(selectedCategories = []) {
  try {
    const response = await fetch('http://localhost:3000/category');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    categories = await response.json();
    renderExistingCategories(categories, selectedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

function renderExistingCategories(categories, selectedCategories = []) {
  const existingCategoriesContainer = document.getElementById('existingCategories');
  existingCategoriesContainer.innerHTML = '';
  categories.forEach(category => {
    const isChecked = selectedCategories.includes(category.catId);
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'form-check d-flex align-items-center';
    categoryDiv.innerHTML = `
      <input class="form-check-input me-2" type="checkbox" name="categories" value="${category.catId}" id="category${category.catId}" ${isChecked ? 'checked' : ''}>
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

async function deleteAllCategoriesForEvent(eventId) {
  try {
    // Fetch existing categories for the event
    const response = await fetch(`http://localhost:3000/getCategoryForEvent/${eventId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories for deletion');
    }
    
    const categories = await response.json();
    
    // Create an array of deletion requests
    const deleteRequests = categories.map(category => {
      return fetch('http://localhost:3000/removeCategoryFromEvent', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventid: eventId, catid: category.CatId })
      });
    });
    
    // Wait for all deletion requests to complete
    await Promise.all(deleteRequests);
    
  } catch (error) {
    console.error('Error deleting categories for event:', error);
  }
}
async function addCategory() {
  const categoryInput = document.getElementById('categoryInput');
  const categoryName = categoryInput.value.trim();

  if (categoryName) {
    try {
      const response = await fetch('http://localhost:3000/category', {
        method: 'POST',
        headers: {
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
async function deleteCategory(categoryId) {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      const response = await fetch(`http://localhost:3000/category/${categoryId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      categories = categories.filter(category => category.catId !== categoryId);
      renderExistingCategories(categories);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Category used in other events');
    }
  }
}
