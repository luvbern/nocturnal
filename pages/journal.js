document.addEventListener("DOMContentLoaded", () => {
    const leftPage = document.getElementById("left-page-content");
    const rightPage = document.getElementById("right-page-content");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const closeBtn = document.getElementById("close-book-btn");
    const book = document.getElementById("journal-book");
    const coverTitle = document.getElementById("cover-year-title");

    let finalPages = []; 
    let currentPageIndex = 0; 
    let isAnimating = false;
    let selectedYearFilter = "2026"; 

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function paginateJournal() {
        finalPages = [];
        const filteredEntries = document.querySelectorAll(`#journal-data .entry[data-year="${selectedYearFilter}"]`);
        
        const tester = document.createElement("div");
        tester.style.position = "absolute";
        tester.style.visibility = "hidden";
        tester.style.height = "auto";
        tester.style.width = isMobile() ? `${book.clientWidth}px` : `${book.clientWidth / 2}px`;
        tester.style.padding = isMobile() ? "30px 25px 50px 25px" : "40px 35px 50px 35px";
        tester.style.boxSizing = "border-box";
        document.body.appendChild(tester);

        const maxHeight = book.clientHeight;

        filteredEntries.forEach(entry => {
            const timeTag = entry.querySelector("time") ? entry.querySelector("time").outerHTML : "";
            
            const entryItems = Array.from(entry.children);
            let currentPageHTML = timeTag;

            entryItems.forEach(item => {
                if (item.tagName.toLowerCase() === 'time') return;

                if (item.classList.contains("polaroid-container")) {
                    let testWithPolaroid = currentPageHTML + item.outerHTML;
                    tester.innerHTML = testWithPolaroid;
                    
                    if (tester.scrollHeight > maxHeight) {
                        if (currentPageHTML.trim() !== "" && currentPageHTML !== timeTag) {
                            finalPages.push(currentPageHTML);
                        }
                        currentPageHTML = (timeTag ? `<span class="continued">Continued...</span>` : "") + item.outerHTML;
                    } else {
                        currentPageHTML += item.outerHTML;
                    }
                } 
                else {
                    const sentences = item.innerHTML.match(/(<img[^>]*>|<[^>]+>|[^.!?<]+(?:[.!?]+(?=\s|<br\/?>|$))?|[^.!?<]+)/g) || [item.innerHTML];
                    let paragraphBuffer = "";

                    sentences.forEach(sentence => {
                        let testHTML = currentPageHTML + (paragraphBuffer ? `<p>${paragraphBuffer}${sentence}</p>` : `<p>${sentence}</p>`);
                        tester.innerHTML = testHTML;

                        if (tester.scrollHeight > maxHeight) {
                            if (paragraphBuffer.trim() !== "") {
                                currentPageHTML += `<p>${paragraphBuffer}</p>`;
                            }
                            if (currentPageHTML.trim() !== "" && currentPageHTML !== timeTag) {
                                finalPages.push(currentPageHTML);
                            }
                            currentPageHTML = timeTag ? `<span class="continued">Continued...</span>` : "";
                            paragraphBuffer = sentence;
                        } else {
                            paragraphBuffer += sentence;
                        }
                    });

                    if (paragraphBuffer.trim() !== "") {
                        currentPageHTML += `<p>${paragraphBuffer}</p>`;
                    }
                }
            });

            if (currentPageHTML.trim() !== "" && currentPageHTML !== timeTag) {
                finalPages.push(currentPageHTML);
            }
        });

        document.body.removeChild(tester);
        if (finalPages.length === 0) finalPages.push(`<p>No entries found for ${selectedYearFilter}.</p>`);
    }

    function updateJournalView(direction = null) {
        if (isMobile()) {
            if (currentPageIndex >= finalPages.length) currentPageIndex = finalPages.length - 1;
            leftPage.innerHTML = finalPages[currentPageIndex];
            rightPage.innerHTML = "";
            
            prevBtn.style.opacity = currentPageIndex === 0 ? "0" : "1";
            nextBtn.style.opacity = currentPageIndex === finalPages.length - 1 ? "0" : "1";
            return;
        }

        if (currentPageIndex % 2 !== 0) currentPageIndex--; 
        
        const oldLeftContent = leftPage.innerHTML;
        const oldRightContent = rightPage.innerHTML;
        
        const nextLeftContent = finalPages[currentPageIndex] || "";
        const nextRightContent = finalPages[currentPageIndex + 1] || "";

        if (!direction) {
            leftPage.innerHTML = nextLeftContent;
            rightPage.innerHTML = nextRightContent;
            updateControls();
            return;
        }

        isAnimating = true; 
        const flipSheet = document.createElement("div");
        flipSheet.classList.add("flip-sheet");

        if (direction === "next") {
            flipSheet.classList.add("turning-next");
            flipSheet.innerHTML = oldRightContent; 
            book.appendChild(flipSheet);

            leftPage.innerHTML = nextLeftContent;
            flipSheet.getBoundingClientRect(); 
            flipSheet.style.transform = "rotateY(-180deg) skewY(-3deg) scaleX(0.95)";
            
            setTimeout(() => { rightPage.innerHTML = nextRightContent; }, 300);
            setTimeout(() => { flipSheet.remove(); isAnimating = false; }, 600);

        } else if (direction === "prev") {
            flipSheet.classList.add("turning-prev");
            flipSheet.innerHTML = oldLeftContent; 
            book.appendChild(flipSheet);

            rightPage.innerHTML = nextRightContent;
            flipSheet.getBoundingClientRect(); 
            flipSheet.style.transform = "rotateY(180deg) skewY(3deg) scaleX(0.95)";
            
            setTimeout(() => { leftPage.innerHTML = nextLeftContent; }, 300);
            setTimeout(() => { flipSheet.remove(); isAnimating = false; }, 600);
        }

        updateControls();
    }

    function updateControls() {
        prevBtn.style.opacity = currentPageIndex === 0 ? "0" : "1";
        nextBtn.style.opacity = currentPageIndex >= finalPages.length - 2 ? "0" : "1";
        
        prevBtn.style.pointerEvents = currentPageIndex === 0 ? "none" : "auto";
        nextBtn.style.pointerEvents = currentPageIndex >= finalPages.length - 2 ? "none" : "auto";
    }

    nextBtn.addEventListener("click", () => {
        if (isAnimating) return;
        if (isMobile()) {
            if (currentPageIndex < finalPages.length - 1) {
                currentPageIndex++;
                updateJournalView("next");
            }
        } else {
            if (currentPageIndex < finalPages.length - 2) {
                currentPageIndex += 2;
                updateJournalView("next");
            }
        }
    });

    prevBtn.addEventListener("click", () => {
        if (isAnimating) return;
        if (currentPageIndex > 0) {
            currentPageIndex -= isMobile() ? 1 : 2;
            updateJournalView("prev");
        }
    });

    closeBtn.addEventListener("click", () => {
        book.classList.add("closed");
    });

    document.querySelectorAll(".year-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const chosenYear = e.target.getAttribute("data-target-year");
            selectedYearFilter = chosenYear;
            coverTitle.innerText = `Journal Log: ${chosenYear}`;
            
            currentPageIndex = 0;
            paginateJournal();
            updateJournalView();
            
            book.classList.remove("closed");
        });
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            paginateJournal();
            updateJournalView();
        }, 150);
    });

    paginateJournal();
    updateJournalView();
});
