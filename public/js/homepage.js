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
        let slide = `
            <div class="slide ${i === 0 ? 'active' : ''}" style="background-image: url('${documentaries[i].image}');">
                <div class="slide-content">
                    <p class="id">${documentaries[i].docid}</p>
                    <h2 class="title">${documentaries[i].title}</h2>
                    <p class="date">${documentaries[i].docDate}</p>
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
  
async function updateHome() {
  const slides = document.querySelectorAll('.slide');
  for (const slide of slides) {
    const slideID = slide.querySelector('.id').textContent.trim();
    console.log(slideID);
    const data = await fetchDoc(slideID);
    if (data) {
      const date = new Date(data.docdate);
      const formattedDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      slide.querySelector('.title').textContent = data.title;
      slide.querySelector('.date').textContent = formattedDate;
      slide.style.backgroundImage = `url('${data.image}')`;
    } else {
      console.error(`Failed to fetch data for slide ID ${slideID}`);
    }
  }
}
  
  
document.addEventListener('DOMContentLoaded', function() {
  updateHome();
  getid();
  generateSlides();
});
