document.addEventListener("DOMContentLoaded", () => {
    const savedName = localStorage.getItem('savedUserName');
    
    if (savedName) {
        const nameElements = document.querySelectorAll('.global-username');
        
        nameElements.forEach(element => {
            element.textContent = savedName;
        });
    }
});
