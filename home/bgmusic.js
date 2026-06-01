const audio = document.getElementById('bgm');

  function tryAutoplay() {
    audio.play().then(() => {
      cleanUpListeners();
    }).catch(error => {
      console.log("Autoplay blocked. Waiting for user interaction to play music.");
    });
  }

  function cleanUpListeners() {
    document.removeEventListener('click', tryAutoplay);
    document.removeEventListener('keydown', tryAutoplay);
  }

  tryAutoplay();

  document.addEventListener('click', tryAutoplay);
  document.addEventListener('keydown', tryAutoplay);
