 let currentIndex = 0;
const viewport = document.getElementById('viewport');
const doors = document.querySelectorAll('.door-container');
let autoScrollInterval; 
let isHovered = false;  

function updateGallery() {
    const activeDoor = doors[currentIndex];
    if (activeDoor) {
        const targetScrollLeft = activeDoor.offsetLeft - (viewport.offsetWidth / 2) + (activeDoor.offsetWidth / 2);
        viewport.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth'
        });
    }
    doors.forEach((door, i) => {
        door.classList.remove('active');
        door.classList.remove('open');
        if (i === currentIndex) {
            door.classList.add('active');
        }
    });
}

function move(dir) {
    currentIndex += dir;
    if (currentIndex < 0) currentIndex = doors.length - 1;
    if (currentIndex >= doors.length) currentIndex = 0;
    updateGallery();
}

function handleDoorClick(index) {
    if (currentIndex === index) {
        doors[index].classList.toggle('open');
    } else {
        currentIndex = index;
        updateGallery();
    }
}

let scrollTimeout;
viewport.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const viewCenter = viewport.scrollLeft + (viewport.offsetWidth / 2);
        doors.forEach((door, index) => {
            const doorStart = door.offsetLeft;
            const doorEnd = doorStart + door.offsetWidth;
            if (viewCenter >= doorStart && viewCenter <= doorEnd) {
                if (currentIndex !== index) {
                    currentIndex = index;
                    doors.forEach((d, i) => {
                        d.classList.toggle('active', i === currentIndex);
                        if (i !== currentIndex) d.remove('open');
                    });
                }
            }
        });
    }, 50);
});


function startAutoMove() {
    autoScrollInterval = setInterval(() => {
        if (!isHovered) {
            move(1);
        }
    }, 3000); 
}

function stopAutoMove() {
    clearInterval(autoScrollInterval);
}

doors.forEach((door) => {
    door.addEventListener('mouseenter', () => {
        isHovered = true;
    });
    
    door.addEventListener('mouseleave', () => {
        isHovered = false;
    });
});

updateGallery();
startAutoMove();
