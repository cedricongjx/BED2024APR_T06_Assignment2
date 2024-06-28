function getCardIDFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('docid'); // Extracts 'cardID' from the query string
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

document.addEventListener('DOMContentLoaded', function() {
    const id = getCardIDFromURL();
    updateDoc(id);
  });