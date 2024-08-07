const joinNowButton = document.getElementById('join-now-button');
const popup = document.getElementById('email-popup');
const closeButton = document.querySelector('.popup .close');

joinNowButton.addEventListener('click', () => {
    popup.style.display = 'block';
});



window.addEventListener('click', (event) => {
    if (event.target == popup) {
        popup.style.display = 'none';
    }
});

async function joinNewsletter(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
  
    const res = await fetch('/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert('Subscription failed: ' + data.error);
      } else {
        alert('Newsletter subscription successful');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Subscription failed: ' + error.message);
    });
  }
  

document.getElementById('email-form').addEventListener('submit', joinNewsletter);