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

document.addEventListener('DOMContentLoaded', function() {
    const id = getCardIDFromURL();
    updateDoc(id);
    document.getElementById('edit-button').addEventListener('click', makeFieldsEditable);
    document.getElementById('ok-button').addEventListener('click', function() {
      saveDoc(id);
    });
    document.getElementById('delete-button').addEventListener('click', function () {
      if (confirm('Are you sure you want to delete this documentary?')) {
          deleteDoc(id);
      }
  });
  });