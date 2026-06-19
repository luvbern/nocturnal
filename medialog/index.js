let currentIndex = 0;
const stage = document.getElementById('stage');
const doors = document.querySelectorAll('.door-container');
const portalScreen = document.getElementById('content-view-screen');
const portalFrame = document.getElementById('portal-frame');

let isTransitioning = false; 

const pageUrls = {
    0: "https://luvbern.github.io/nocturnal/medialog/animelog.html",
    1: "https://luvbern.github.io/nocturnal/medialog/comicslog.html", 
    2: "https://luvbern.github.io/nocturnal/medialog/animelog.html",
    3: "https://luvbern.github.io/nocturnal/medialog/animelog.html"
};

const totalDoors = doors.length;

function layoutVerticalRabbitHole() {
    doors.forEach((door, i) => {
        let offset = i - currentIndex;
        
        let yTranslate = offset * 580; 
        
        let zTranslate = Math.abs(offset) * -180; 
        let xRotate = offset * -15; 
        let yRotate = offset * 10; 
        
        door.classList.remove('active');
        
        if (i === currentIndex) {
            door.classList.add('active');
            door.style.opacity = "1";
            door.style.transform = `translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg)`;
        } else {
            door.style.opacity = "0.45";
            door.style.transform = `translateY(${yTranslate}px) translateZ(${zTranslate}px) rotateX(${xRotate}deg) rotateY(${yRotate}deg)`;
        }
    });
}

function move(dir) {
    currentIndex += dir;
    if (currentIndex < 0) currentIndex = totalDoors - 1;
    if (currentIndex >= totalDoors) currentIndex = 0;
    layoutVerticalRabbitHole();
}

window.addEventListener('wheel', (e) => {
    if (stage.classList.contains('zoomed-in') || isTransitioning) return;

    isTransitioning = true;
    if (e.deltaY > 0) {
        move(1);
    } else {
        move(-1); 
    }
    
    setTimeout(() => { isTransitioning = false; }, 300);
}, { passive: true });

function handleDoorClick(index) {
    if (currentIndex !== index) {
        currentIndex = index;
        layoutVerticalRabbitHole();
        return;
    }

    const activeDoor = doors[index];
    activeDoor.classList.add('open');

    setTimeout(() => {
        stage.classList.add('zoomed-in');
        portalFrame.src = pageUrls[index] || "";

        setTimeout(() => {
            portalScreen.classList.add('visible');
        }, 900);

    }, 600); 
}

function closePortalPage() {
    portalScreen.classList.remove('visible');
    setTimeout(() => {
        portalFrame.src = "about:blank";
        stage.classList.remove('zoomed-in');
        doors.forEach(door => door.classList.remove('open'));
    }, 400);
}

layoutVerticalRabbitHole();
