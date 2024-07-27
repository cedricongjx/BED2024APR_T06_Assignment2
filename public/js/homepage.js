let currentSlide = 0;

async function generateSlides() {
  try {
    const response = await fetch(`/documentary`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const documentaries = await response.json();
    
    displayDocumentaries(documentaries);
  } catch (error) {
      console.error('Error generating slides:', error);
  }
}

async function filterSlides(category) {
  try {
    const response = await fetch(`/documentary/category/${category}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const documentaries = await response.json();
    
    displayDocumentaries(documentaries);
  } catch (error) {
      console.error('Error generating slides:', error);
  }
}

async function searchDoc(){
  try {
    const searchTerm = document.getElementById('search-bar').value;
    console.log(searchTerm)
    const response = await fetch(`/documentary/search?searchTerm=${searchTerm}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const documentaries = await response.json();
    console.log(documentaries)
    displayDocumentaries(documentaries);
  } catch (error) {
      console.error('Error generating slides:', error);
  }
}

async function avgStars(id) {
  try {
    const response = await fetch(`/review/average/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const stars = await response.json();
    return stars !== null ? parseInt(stars) : 'No reviews yet';


  } catch (error) {
      console.error('Error generating slides:', error);
  }
}

async function numOfReviews(id) {
  try {
    const response = await fetch(`/review/total/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const total = await response.json();
    return total != 0 ? `${total} Review(s)` : '';

  } catch (error) {
      console.error('Error generating slides:', error);
  }
}

async function displayDocumentaries(documentaries) {
  const slider = document.querySelector('.slider');
  slider.innerHTML = '';

  for (let i = 0; i < documentaries.length; i++) {
    console.log(documentaries[i])
    const date = new Date(documentaries[i].docdate);
    const stars = await avgStars(documentaries[i].docid);
    const totalReviews = await numOfReviews(documentaries[i].docid);
    const starsDiv = document.createElement('div');
    starsDiv.style.display = "flex";
    starsDiv.style.alignItems = "center";
    starsDiv.style.gap = "4px";
    if (stars != 'No reviews yet'){

      // Generate stars based on the review's rating
      const starsCount = parseFloat(stars);
      for (let j = 1; j <= 5; j++) {
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
          if (j > starsCount) {
              star.setAttribute("stroke", "#e5e7eb"); // Change color if the star number is greater than the review rating
          }
          starsDiv.appendChild(star);
      }
      starsDiv.append(totalReviews);
    }
    else{
      starsDiv.append(stars);
    }
    const formattedDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    let slide = `
        <div class="slide ${i === 0 ? 'active' : ''}" style="background-image: url('${documentaries[i].image}');">
            <div class="slide-content">
                <p class="id">${documentaries[i].docid}</p>
                <h2 class="title">${documentaries[i].title}</h2>
                <p class="date">${formattedDate}</p>
                <p class="stars">${starsDiv.outerHTML}</p>
                <p class="cat">${documentaries[i].doccategory}</p>
            </div>
        </div>\n`;
      slider.innerHTML += slide;
  }
  getId();
};

document.querySelector('.next').addEventListener('click', () => {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
});

document.querySelector('.prev').addEventListener('click', () => {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
});

function getId(){
  document.querySelectorAll('.slide').forEach(button => {
      button.addEventListener('click', function() {
          const slideID = button.querySelector('.id').textContent.trim();
          window.location.href = "documentary.html?docid=" + encodeURIComponent(slideID);
      });
  })

}

function hideAdd(){
  const token = localStorage.getItem('token');
  if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'A') {
          document.getElementById('add-button').style.display = 'none';
      }
  } else {
      console.warn('Token not found in localStorage');
  }
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
  
  
function showAddModal() {

  let addButton = document.querySelector('.add-button');
  let modal = document.getElementById('addModal');
  let span = document.getElementsByClassName('close')[0];

  addButton.addEventListener('click', function() {
    modal.style.display = 'block';
  });

  span.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });

}
async function createDoc(event) {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  const form = document.getElementById('addDocForm');
  const formData = new FormData(form);

  try {
    const response = await fetch('/documentary', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      alert('Documentary added successfully!');
      document.getElementById('addModal').style.display = 'none';
      window.location.reload(); // Reload the page
    } else {
      alert('Error adding documentary');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error adding documentary');
  }
}
document.addEventListener('DOMContentLoaded', async function() {
  await generateSlides();
  //hideAdd();
  showAddModal();
  document.getElementById('addDocForm').addEventListener('submit', createDoc);
  document.getElementById('category-filter').addEventListener('change', function() {
    const selectedCategory = this.value;
    if (selectedCategory != 'All'){
      filterSlides(selectedCategory);
    }
    else{
      generateSlides();
    }
  });
  document.getElementById('search-bar').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchDoc();
        }
    });
});

