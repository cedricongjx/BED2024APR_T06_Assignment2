function scrollPrev() {
    document.getElementById('cardContainer').scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  }

  function scrollNext() {
    document.getElementById('cardContainer').scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  }