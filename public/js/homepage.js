let currentSlide = 0;

async function generateSlides() {
  try {
    const response = await fetch(`/api/documentary`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const documentaries = await response.json();
    
    let slider = document.querySelector('.slider');
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
              </div>
          </div>\n`;
        slider.innerHTML += slide;
    }
    slider += '</div>';
      console.log(slider);
  } catch (error) {
      console.error('Error generating slides:', error);
  }
}
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

function getid(){
  document.querySelectorAll('.slide').forEach(button => {
      button.addEventListener('click', function() {
          const slideID = button.querySelector('.id').textContent.trim();
          window.location.href = "documentary.html?docid=" + encodeURIComponent(slideID);
      });
  })

}



async function fetchDoc(id) {
    try {
      const response = await fetch(`/api/documentary/${id}`);
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
  
  
  
document.addEventListener('DOMContentLoaded', async function() {
  await generateSlides();
  getid();
});


