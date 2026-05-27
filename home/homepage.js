document.addEventListener("DOMContentLoaded", () => {
    const savedName = localStorage.getItem('savedUserName');
    
    if (savedName) {
        const nameElements = document.querySelectorAll('.global-username');
        
        nameElements.forEach(element => {
            element.textContent = savedName;
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const clockElement = document.getElementById('digital-clock');
  
  function updateClock() {
    if (!clockElement) return;
    const now = new Date();
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const formattedHours = String(hours).padStart(2, '0');
    
    clockElement.textContent = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
  }
  
  updateClock();
  setInterval(updateClock, 1000);

  function generateCalendar() {
    const monthYearElement = document.getElementById('calendar-month-year');
    const datesContainer = document.getElementById('calendar-dates');
    
    if (!monthYearElement || !datesContainer) return;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); 
    const currentDate = now.getDate(); 
    
    const months = [
      "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", 
      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];
    
    monthYearElement.textContent = `${months[currentMonth]} ${currentYear}`;
    
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    let htmlContent = '';
    
    for (let i = 0; i < firstDayIndex; i++) {
      htmlContent += `<div class="cal-date empty"></div>`;
    }
    
    for (let day = 1; day <= totalDays; day++) {
      if (day === currentDate) {
        htmlContent += `<div class="cal-date active-day">${day}</div>`;
      } else {
        htmlContent += `<div class="cal-date">${day}</div>`;
      }
    }
    
    datesContainer.innerHTML = htmlContent;
  }
  
  generateCalendar();


  const tabs = document.querySelectorAll('.nav-tab');
  const articles = document.querySelectorAll('.content-view');
  const searchBar = document.getElementById('browser-url');
  
  const btnBack = document.getElementById('goBack');
  const btnForward = document.getElementById('goForward');
  
  const kebabBtn = document.getElementById('kebab-btn');
  const menuNav = document.getElementById('menu-navigation');
  const mobileTitle = document.getElementById('mobile-current-title');
  
  const browserWindow = document.getElementById('browser-window');
  const closeBtn = document.getElementById('closeBrowser');
  const openBrowserBtn = document.getElementById('open-browser-btn');
  
  const baseUrl = "nocturnaldiary.neocities.org/pages/home";

  if (closeBtn && browserWindow) {
    closeBtn.addEventListener('click', () => {
      browserWindow.classList.add('window-closed');
    });
  }

  if (openBrowserBtn && browserWindow) {
    openBrowserBtn.addEventListener('click', () => {
      browserWindow.classList.remove('window-closed');
    });
  }

  let historyStack = [];
  let historyIndex = -1;
  let isNavigatingHistory = false;

  function switchTab(targetId) {
    const targetTab = document.querySelector(`[data-target="${targetId}"]`);
    const targetArticle = document.getElementById(targetId);

    if (!targetTab || !targetArticle) return;

    tabs.forEach(t => t.classList.remove('active'));
    targetTab.classList.add('active');

    articles.forEach(article => article.classList.remove('active-view'));
    targetArticle.classList.add('active-view');

    if (mobileTitle) {
      mobileTitle.textContent = targetTab.textContent;
    }

    if (searchBar) {
      if (targetId === 'welcome') {
        searchBar.textContent = baseUrl; 
      } else {
        searchBar.textContent = `nocturnaldiary.neocities.org/pages/${targetId}`;
      }
    }

    localStorage.setItem('savedTab', targetId);

    if (!isNavigatingHistory) {
      if (historyIndex < historyStack.length - 1) {
        historyStack = historyStack.slice(0, historyIndex + 1);
      }
      historyStack.push(targetId);
      historyIndex = historyStack.length - 1;
    }

    updateButtonStates();
  }

  function updateButtonStates() {
    if (btnBack) {
      if (historyIndex > 0) {
        btnBack.classList.remove('disabled-nav');
      } else {
        btnBack.classList.add('disabled-nav');
      }
    }
    
    if (btnForward) {
      if (historyIndex < historyStack.length - 1) {
        btnForward.classList.remove('disabled-nav');
      } else {
        btnForward.classList.add('disabled-nav');
      }
    }
  }

  if (btnBack) {
    btnBack.addEventListener('click', (e) => {
      if (btnBack.classList.contains('disabled-nav')) {
        e.preventDefault();
        return;
      }
      if (historyIndex > 0) {
        isNavigatingHistory = true;
        historyIndex--;
        switchTab(historyStack[historyIndex]);
        isNavigatingHistory = false;
      }
    });
  }

  if (btnForward) {
    btnForward.addEventListener('click', (e) => {
      if (btnForward.classList.contains('disabled-nav')) {
        e.preventDefault();
        return;
      }
      if (historyIndex < historyStack.length - 1) {
        isNavigatingHistory = true;
        historyIndex++;
        switchTab(historyStack[historyIndex]);
        isNavigatingHistory = false;
      }
    });
  }

  const savedTabId = localStorage.getItem('savedTab');
  if (savedTabId) {
    switchTab(savedTabId); 
  } else {
    switchTab('welcome');  
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault(); 
      const targetId = tab.dataset.target;
      switchTab(targetId);

      if (window.innerWidth < 768 && menuNav) {
        menuNav.classList.remove('menu-open');
      }
    });
  });

  if (kebabBtn && menuNav) {
    kebabBtn.addEventListener('click', (e) => {
      e.stopPropagation(); 
      menuNav.classList.toggle('menu-open');
    });
  }

  document.addEventListener('click', () => {
    if (window.innerWidth < 768 && menuNav) {
      menuNav.classList.remove('menu-open');
    }
  });
});
