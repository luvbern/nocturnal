let currentIndex = 0;
        const viewport = document.getElementById('viewport');
        const doors = document.querySelectorAll('.door-container');

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
            if (currentIndex < 0) currentIndex = 0;
            if (currentIndex >= doors.length) currentIndex = doors.length - 1;
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

        updateGallery();
