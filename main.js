// Global Variables
let activeWindow = null;
let offset = { x: 0, y: 0 };
let isDragging = false;
let audio;
let progressBar;
let currentSongIndex = 0;

const songs = [
    { src: "/assets/frutiger aero.mp3", title: "Frutiger Aero" },
    { src: "/assets/The HampsterDance Song.mp3", title: "Hampster Dance" },
    { src: "/assets/Keyboard Cat! - THE ORIGINAL!.mp3", title: "Keyboard Cat" },
    { src: "/assets/009 Sound System - With a Spirit (Short Version).mp3", title: "009 Sound System" },
    { src: "/assets/scizzie - aquatic ambience.mp3", title: "Aquatic Ambience" }
];

// Exposing Functions to Global Scope
window.openWindow = openWindow;
window.closeWindow = closeWindow;
window.clippySpeak = clippySpeak;
window.togglePlay = togglePlay;
window.nextSong = nextSong;
window.stopAudio = stopAudio;
window.updateVolume = updateVolume;
window.changeView = changeView;
window.closeWindowMP3 = closeWindowMP3;
window.openWindowMP3 = openWindowMP3;


// DOMContentLoaded Listener
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    cursor.style.display = 'block';

    audio = document.getElementById('xp-audio');
    progressBar = document.querySelector('.progress-bar');

    // Preload first song
    preloadFirstSong();

    // Audio Event Listeners
    audio.addEventListener('timeupdate', updateProgressBar);
    audio.addEventListener('loadedmetadata', resetProgressBar);
    audio.addEventListener('ended', nextSong);

    // Welcome Window Setup
    const player = document.getElementById('mp3-player');
    player.style.display = 'block';
    setTimeout(() => {
        openWindow('welcome');
        positionWelcomeWindow();
    }, 500);

    // Debounce Mouse Movement for Custom Cursor
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    document.addEventListener('mousemove', debounce(updateCursor, 5));
    document.addEventListener('mouseleave', () => (cursor.style.opacity = '0'));
    document.addEventListener('mouseenter', () => (cursor.style.opacity = '1'));

    // Hover Effects for Cursor
    setupHoverEffects();

    // Start Menu Toggle
    setupStartMenu();
});

// Helper Functions
function preloadFirstSong() {
    const songInfo = document.querySelector('.song-info');
    const firstSong = songs[0];
    audio.src = firstSong.src;
    audio.load();
    songInfo.textContent = `Now Playing: ${firstSong.title}`;
    audio.volume = 0.5;
}

function updateProgressBar() {
    if (audio.duration && !isNaN(audio.duration)) {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
    }
}

function resetProgressBar() {
    progressBar.value = 0;
}

function positionWelcomeWindow() {
    const welcomeWindow = document.getElementById('welcome-window');
    welcomeWindow.style.left = '50%';
    welcomeWindow.style.top = '50%';
    welcomeWindow.style.transform = 'translate(-50%, -50%)';
    welcomeWindow.style.width = '500px';
}

function updateCursor(e) {
    const cursor = document.querySelector('.custom-cursor');
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
}

function setupHoverEffects() {
    const hoverableElements = document.querySelectorAll('.desktop-icon, .window-header, .close-btn, .clippy, .start-button');
    const cursorImg = document.querySelector('.custom-cursor img');

    hoverableElements.forEach(element => {
        element.addEventListener('mouseenter', () => (cursorImg.src = '/assets/handcursor.png'));
        element.addEventListener('mouseleave', () => (cursorImg.src = '/assets/cursorwhitepng.png'));
    });
}

function setupStartMenu() {
    let startMenuOpen = false;
    const startButton = document.querySelector('.start-button');
    const startMenu = document.querySelector('.start-menu');

    startButton.addEventListener('click', () => {
        startMenuOpen = !startMenuOpen;
        startMenu.style.display = startMenuOpen ? 'block' : 'none';
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.start-menu') && !e.target.closest('.start-button')) {
            startMenu.style.display = 'none';
            startMenuOpen = false;
        }
    });

    setupStartMenuEasterEggs();
}

function setupStartMenuEasterEggs() {
    const startMenuItems = document.querySelectorAll('.start-menu-item');
    startMenuItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            switch (index) {
                case 0:
                    alert('You are not supposed to be here...');
                    break;
                case 1:
                    document.body.style.transition = 'transform 1s';
                    document.body.style.transform = 'rotate(360deg)';
                    setTimeout(() => (document.body.style.transform = 'rotate(0deg)'), 1000);
                    break;
                case 2:
                    const messages = ["You're not supposed to be here...", "Don't keep trying go away" , "REALLY?" ];
                    alert(messages[Math.floor(Math.random() * messages.length)]);
                    break;
            }
        });
    });
}

// Window Management Functions
function openWindow(id) {
    const windowElement = document.getElementById(`${id}-window`);
    windowElement.style.display = 'block';
    windowElement.style.left = '50%';
    windowElement.style.top = '50%';
    windowElement.style.transform = 'translate(-50%, -50%)';

    if (activeWindow) {
        activeWindow.style.zIndex = '1';
        activeWindow.classList.remove('active');
    }
    windowElement.style.zIndex = '2';
    windowElement.classList.add('active');
    activeWindow = windowElement;

    const header = windowElement.querySelector('.window-header');
    header.addEventListener('mousedown', startDragging);
}
function openWindowMP3(id) {
  const windowElement = document.getElementById(id);
  windowElement.style.display = 'block';
  windowElement.style.left = '50%';
  windowElement.style.top = '50%';
  windowElement.style.transform = 'translate(-50%, -50%)';

  if (activeWindow) {
      activeWindow.style.zIndex = '1';
      activeWindow.classList.remove('active');
  }
  windowElement.style.zIndex = '2';
  windowElement.classList.add('active');
  activeWindow = windowElement;

  const header = windowElement.querySelector('.window-header');
  header.addEventListener('mousedown', startDragging);
}

function closeWindow(id) {
  const windowElement = document.getElementById(`${id}-window`);
  if (windowElement) {
      windowElement.style.opacity = '0';
      windowElement.style.transform = 'scale(0.7)';
      setTimeout(() => {
          windowElement.style.display = 'none';
          windowElement.style.opacity = '1';
          windowElement.style.transform = 'scale(1)';
      }, 300); // Matches the animation duration
  } else {
      console.error(`Window with ID "${id}" not found.`);
  }
}
function closeWindowMP3(id) {
  const windowElement = document.getElementById(id);
  if (windowElement) {
      windowElement.style.opacity = '0';
      windowElement.style.transform = 'scale(0.7)';
      setTimeout(() => {
          windowElement.style.display = 'none';
          windowElement.style.opacity = '1';
          windowElement.style.transform = 'scale(1)';
      }, 300); // Matches the animation duration
  } else {
      console.error(`Window with ID "${id}" not found.`);
  }
}


function changeView(viewType) {
  const container = document.querySelector('.gallery-grid');
  if (viewType === 'thumbnails') {
      container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
  } else {
      container.style.gridTemplateColumns = '1fr';
  }
}

// Dragging Windows
function startDragging(e) {
    if (!isDragging) {
        isDragging = true;
        const windowElement = e.target.closest('.window');
        activeWindow = windowElement;

        if (activeWindow) {
            document.querySelectorAll('.window').forEach(w => {
                w.style.zIndex = '1';
                w.classList.remove('active');
            });
            activeWindow.style.zIndex = '2';
            activeWindow.classList.add('active');
        }

        const rect = windowElement.getBoundingClientRect();
        offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
    }
}

function drag(e) {
    if (isDragging && activeWindow) {
        e.preventDefault();
        const x = e.clientX - offset.x;
        const y = e.clientY - offset.y;

        activeWindow.style.left = `${x}px`;
        activeWindow.style.top = `${y}px`;
        activeWindow.style.transform = 'none';
    }
}

function stopDragging() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDragging);
}

// Audio Functions
function togglePlay() {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

function stopAudio() {
    audio.pause();
    audio.currentTime = 0;
    progressBar.value = 0;
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
}

function playSong(index) {
    const songInfo = document.querySelector('.song-info');
    progressBar.value = 0;

    audio.src = songs[index].src;
    audio.load();
    songInfo.textContent = `Now Playing: ${songs[index].title}`;
    audio.addEventListener('loadedmetadata', () => audio.play());
}

function updateVolume(value) {
    audio.volume = value;
}

// Clippy
function clippySpeak() {
    const balloon = document.querySelector('.clippy-balloon');
    balloon.style.display = balloon.style.display === 'none' || !balloon.style.display ? 'block' : 'none';

    if (balloon.style.display === 'block') {
        const clippyMessages = [
            "Hi! I'm Clippy, your office assistant. It looks like you're exploring a portfolio. Would you like help with that?",
            "Need help navigating around? Try clicking on the desktop icons!",
            "Did you know you can drag windows around by their title bars?",
            "Want to contact the portfolio owner? Try clicking the Contact icon!",
            "Looking for technical skills? The Skills icon might be helpful!"
        ];
        const currentMessageIndex = Math.floor(Math.random() * clippyMessages.length);
        balloon.textContent = clippyMessages[currentMessageIndex];
    }
}
