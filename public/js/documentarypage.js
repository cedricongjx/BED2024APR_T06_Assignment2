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
    console.log(data)
    const date = new Date(data.docdate);
    const formattedDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('title').textContent = data.title;
    document.getElementById('date').textContent = formattedDate;
    document.getElementById('docimage').src = data.image;
    document.getElementById('documentary').textContent = data.documentary;
    }
}

function makeFieldsEditable() {
  const title = document.getElementById('title');
  const date = document.getElementById('date');
  const documentary = document.getElementById('documentary');

  title.contentEditable = true;
  date.contentEditable = true;
  documentary.contentEditable = true;

  document.getElementById('ok-button').style.display = 'inline';
  document.getElementById('edit-button').style.display = 'none';

  title.focus(); // Focus on the title field to start editing
}

async function saveDoc(id) {
  const title = document.getElementById('title').textContent;
  const docdate = document.getElementById('date').textContent;
  const documentary = document.getElementById('documentary').textContent;
  const image = document.getElementById('docimage').src;

  const docData = {
      title,
      docdate,
      documentary,
      image
  };

  try {
      const response = await fetch(`/documentary/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(docData)
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      document.getElementById('title').contentEditable = false;
      document.getElementById('date').contentEditable = false;
      document.getElementById('documentary').contentEditable = false;

      document.getElementById('ok-button').style.display = 'none';
      document.getElementById('edit-button').style.display = 'inline';

      alert('Documentary updated successfully!');
  } catch (error) {
      console.error('Error:', error);
      alert('Failed to update documentary');
  }
}


document.addEventListener('DOMContentLoaded', function() {
    const id = getCardIDFromURL();
    updateDoc(id);
    document.getElementById('edit-button').addEventListener('click', makeFieldsEditable);
    document.getElementById('ok-button').addEventListener('click', function() {
      saveDoc(id);
    });
  });