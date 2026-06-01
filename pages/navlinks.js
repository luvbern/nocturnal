window.addEventListener('scroll', () => {
  const cat = document.getElementById('scrolling-cat');
  const scrollPosition = window.scrollY;

  if (scrollPosition < 200) {
    cat.classList.remove('left-side', 'right-side');
  } 
  else if (scrollPosition >= 200 && scrollPosition < 800) {
    cat.classList.add('left-side');
    cat.classList.remove('right-side');
  } 
  else if (scrollPosition >= 800) {
    cat.classList.add('right-side');
    cat.classList.remove('left-side');
  }
});
