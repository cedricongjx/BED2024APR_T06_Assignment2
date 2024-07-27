function getCardIDFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('docid'); // Extracts 'cardID' from the query string
}

async function fetchDoc(id) {
    try {
      const response = await fetch(`/documentary/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
}
  
async function updateDoc(id) {
  const data = await fetchDoc(id);
  if (data) {
      console.log(data);
      const date = new Date(data.docdate);
      const formattedDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      document.getElementById('title').textContent = data.title;
      document.getElementById('date').textContent = formattedDate;
      document.getElementById('image').src = data.image;
      document.getElementById('doccategory').textContent = data.doccategory;
      document.getElementById('documentary').textContent = data.documentary;
      document.getElementById('current-image').src = data.image;
  }
}

function makeFieldsEditable() {
  const title = document.getElementById('title');
  const date = document.getElementById('date');
  const documentary = document.getElementById('documentary');
  const doccategory = document.getElementById('doccategory');
  const image = document.getElementById('image');
  const imageInput = document.getElementById('image-input');

  title.contentEditable = true;
  date.contentEditable = true;
  documentary.contentEditable = true;

  // Replace doccategory text with dropdown
  const doccategoryText = doccategory.textContent;
  const doccategoryDropdown = document.createElement('select');
  doccategoryDropdown.id = 'edit-doccategory';
  doccategoryDropdown.style.width = '100%';
  doccategoryDropdown.style.height = '40px';
  doccategoryDropdown.style.fontSize = '16px';
  const categories = ['Healthcare', 'Education', 'Agriculture', 'Food and Nutrition', 'Environment'];
  categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      if (category === doccategoryText) {
          option.selected = true;
      }
      doccategoryDropdown.appendChild(option);
  });
  doccategory.replaceWith(doccategoryDropdown);

  // Show image input
  image.style.display = 'none';
  imageInput.style.display = 'block';
  imageInput.style.width = '100%';
  imageInput.style.height = '40px';
  imageInput.style.fontSize = '16px';

  document.getElementById('ok-button').style.display = 'inline';
  document.getElementById('edit-button').style.display = 'none';

  title.focus(); // Focus on the title field to start editing
}

async function saveDoc(id) {
  const title = document.getElementById('title').textContent;
  const docdate = document.getElementById('date').textContent;
  const documentary = document.getElementById('documentary').textContent;

  const doccategoryDropdown = document.getElementById('edit-doccategory');
  let doccategory = doccategoryDropdown.value;

  const imageInput = document.getElementById('image-input');
  let image;
  if (imageInput.files.length > 0) {
      image = imageInput.files[0];
  } else {
      image = document.getElementById('current-image').src;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('docdate', docdate);
  formData.append('documentary', documentary);
  formData.append('doccategory', doccategory);
  formData.append('image', image);



  try {
      const response = await fetch(`/documentary/${id}`, {
          method: 'PUT',
          body: formData
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const doccategoryText = document.createElement('h2');
      doccategoryText.id = 'doccategory';
      doccategoryText.textContent = doccategoryDropdown.options[doccategoryDropdown.selectedIndex].text;
      doccategoryDropdown.replaceWith(doccategoryText);

      alert('Documentary updated successfully!');
      window.location.reload(); // Reload the page to reflect the updates
  } catch (error) {
      console.error('Error:', error);
      alert('Failed to update documentary');
  }
}


async function deleteDoc(id) {
  try {
    const response = await fetch(`/documentary/${id}`, {
      method: 'DELETE'
  });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    else{
      alert("Successfully deleted documentary");
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function fetchReviews(id) {
  try {
      const response = await fetch(`/documentary/review/${id}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error:', error);
      return [];
  }
}

async function createdReview(id) {
  try {
    const token = localStorage.getItem('token');
    if (token != null){
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userid = payload.id;
      const response = await fetch(`/review/documentary/${id}?userid=${userid}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data) {
        document.getElementById('review-message').style.display = 'block';
        document.getElementById('submit-review').style.display = 'none'; // Disable the submit button
      } else {
        document.getElementById('review-message').style.display = 'none';
        document.getElementById('submit-review').display = 'block'; // Enable the submit button
      }
    }
  } catch (error) {
      console.error('Error:', error);
      return [];
  }
}

async function displayReviews(id) {
  const reviews = await fetchReviews(id);
  const reviewsContainer = document.getElementById('reviews-container');
  reviewsContainer.innerHTML = ''; // Clear existing reviews
  
  if (reviews.length === 0) {
    // No reviews available
    const noReviewsDiv = document.createElement('div');
    noReviewsDiv.textContent = 'No Reviews Yet';
    noReviewsDiv.style.textAlign = 'center';
    noReviewsDiv.style.marginTop = '20px';
    noReviewsDiv.style.fontSize = '18px';
    noReviewsDiv.style.color = '#6b7280';
    reviewsContainer.appendChild(noReviewsDiv);
  } else {
    reviews.forEach(review => {
      const reviewDiv = document.createElement('div');
      reviewDiv.style.border = "1px solid #cbd5e1";
      reviewDiv.style.borderRadius = "8px";
      reviewDiv.style.padding = "16px";
      reviewDiv.style.display = "flex";
      reviewDiv.style.flexDirection = "column";
      reviewDiv.style.gap = "8px";
      reviewDiv.style.marginBottom = "8px";
      
      // Header with username and review date
      const headerDiv = document.createElement('div');
      headerDiv.style.display = "flex";
      headerDiv.style.alignItems = "center";
      headerDiv.style.gap = "8px";
      headerDiv.innerHTML =`
          <h3 style="font-size: 18px;">${review.username}</h3>
          <p style="font-size: 14px; color: #6b7280;">${new Date(review.date).toLocaleDateString()}</p>`
      ;
      
      // Star ratings
      const starsDiv = document.createElement('div');
      starsDiv.style.display = "flex";
      starsDiv.style.alignItems = "center";
      starsDiv.style.gap = "4px";

      // Generate stars based on the review's rating
      for (let i = 1; i <= 5; i++) {
          const star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          star.setAttribute("viewBox", "0 0 24 24");
          star.setAttribute("width", "20");
          star.setAttribute("height", "20");
          star.setAttribute("stroke-width", "2");
          star.setAttribute("stroke", "#fab005");
          star.setAttribute("fill", "none");
          star.setAttribute("stroke-linecap", "round");
          star.setAttribute("stroke-linejoin", "round");
          star.innerHTML = '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.25l3.885 2.185 -1.503 -4.355l3.618 -3.45h-4.485l-1.515 -4.355l-1.515 4.355h-4.485l3.618 3.45l-1.503 4.355z"/>';
          if (i > review.stars) {
              star.setAttribute("stroke", "#e5e7eb"); // Change color if the star number is greater than the review rating
          }
          starsDiv.appendChild(star);
      }
      
      const ratingText = document.createElement('p');
      ratingText.style.fontSize = "14px";
      ratingText.style.color = "#6b7280";
      ratingText.textContent = `${review.stars} out of 5`;
      starsDiv.appendChild(ratingText);
      
      // Review text
      const reviewText = document.createElement('p');
      reviewText.textContent = review.review;
      
      // Compose elements
      reviewDiv.appendChild(headerDiv);
      reviewDiv.appendChild(starsDiv);
      reviewDiv.appendChild(reviewText);
      
      // Append the complete review div to the container
      reviewsContainer.appendChild(reviewDiv);
    });
  }

}; 


async function addReview(id, review, stars, date, userid) {
  try {
      const response = await fetch(`/review/${id}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ review, stars, date, userid })
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      
      alert('Review added successfully!');
      window.location.reload();// Refresh the reviews list
  } catch (error) {
      console.error('Error:', error);
      alert('Failed to add review');
  }
}

// Add a global variable to store the current star rating
let selectedStars = 0;

// Function to update star ratings
function updateStarRating(rating) {
  selectedStars = rating;
  // Update star colors based on rating
  for (let i = 1; i <= 5; i++) {
    const star = document.getElementById(`star-${i}`);
    if (i <= rating) {
      star.style.color = '#FFD700'; // Gold color for selected stars
    } else {
      star.style.color = '#3b82f6'; // Default color
    }
  }
}

// Add event listeners to star SVGs
for (let i = 1; i <= 5; i++) {
  const star = document.getElementById(`star-${i}`);
  star.addEventListener('click', () => updateStarRating(i));
}

// Function to handle review submission
async function handleSubmitReview() {
  const token = localStorage.getItem('token');
  if (token == null){
    alert("Please log in before making a review.");
    window.location.href = 'loginsignup.html';
  }
  else{
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userid = payload.id
    const id = getCardIDFromURL();
    const reviewText = document.getElementById('review').value;
    const stars = selectedStars;
    const currentDate = new Date();

    const date = currentDate.toLocaleDateString();

    if (!reviewText || stars === 0) {
      alert('Please provide a review and select a star rating.');
      return;
    }
    if (reviewText > 500) {
      alert('Too many characters.');
      return;
    }
    await addReview(id, reviewText, stars, date, userid);
  }
}

function hideAdmin(){
  const token = localStorage.getItem('token');
  if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'A') {
          document.getElementById('edit-button').style.display = 'none';
          document.getElementById('delete-button').style.display = 'none';
      }
      else{
        document.querySelector('.review-form-container').style.display = 'none';
      }
  } else {
      console.warn('Token not found in localStorage');
  }
}

document.addEventListener('DOMContentLoaded', function() {
    const reviewTextarea = document.getElementById('review');
    const reviewLengthLabel = document.getElementById('review-length');

    // Update review length label on input
    reviewTextarea.addEventListener('input', function() {
      reviewLengthLabel.textContent = `Review length: ${reviewTextarea.value.length}`;
    });

    hideAdmin();
    const id = getCardIDFromURL();
    createdReview(id);
    updateDoc(id);
    displayReviews(id);
    
    document.getElementById('edit-button').addEventListener('click', makeFieldsEditable);
    document.getElementById('ok-button').addEventListener('click', function() {
      saveDoc(id);
    });
    document.getElementById('delete-button').addEventListener('click', function () {
      if (confirm('Are you sure you want to delete this documentary?')) {
          deleteDoc(id);
      }
  });

  document.getElementById('submit-review').addEventListener('click', handleSubmitReview);
});
