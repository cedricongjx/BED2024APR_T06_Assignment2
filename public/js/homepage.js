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
function displayDocumentaries(documentaries) {
  const slider = document.querySelector('.slider');
  slider.innerHTML = '';

  slider.innerHTML = '';
  for (let i = 0; i < documentaries.length; i++) {
    console.log(documentaries[i])
    const date = new Date(documentaries[i].docdate);
    const formattedDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    let slide = `
        <div class="slide ${i === 0 ? 'active' : ''}" style="background-image: url('${documentaries[i].image}');">
            <div class="slide-content">
                <p class="id">${documentaries[i].docid}</p>
                <h2 class="title">${documentaries[i].title}</h2>
                <p class="date">${formattedDate}</p>
                <p class="cat">${documentaries[i].doccategory}</p>
            </div>
        </div>\n`;
      slider.innerHTML += slide;
  }
  slider += '</div>';
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
  hideAdd();
  getId();
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

