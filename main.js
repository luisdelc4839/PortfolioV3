let activeWindow = null;
let offset = { x: 0, y: 0 };
let isDragging = false;
let audio;
let progressBar;
window.openWindow = openWindow;
window.closeWindow = closeWindow;
window.clippySpeak = clippySpeak;

const songs = [
    {
        src: "/frutiger aero.mp3",
        title: "Frutiger Aero"
    },
    {
        src: "/The HampsterDance Song.mp3",
        title: "Hampster Dance"
    },
    {
        src: "/Keyboard Cat! - THE ORIGINAL!.mp3",
        title: "Keyboard Cat"
    },
    {
        src: "/009 Sound System - With a Spirit (Short Version).mp3",
        title: "009 Sound System"
    },
    {
        src: "/scizzie - aquatic ambience.mp3",
        title: "Aquatic Ambience"
    }
];

let currentSongIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    cursor.style.display = 'block';

    audio = document.getElementById('xp-audio');
    audio.volume = 0.5; // Set initial volume to 50%
    progressBar = document.querySelector('.progress-bar');
    
    audio.addEventListener('timeupdate', () => {
        if (audio.duration && !isNaN(audio.duration)) {
            const progress = (audio.currentTime / audio.duration) * 100;
            if (!isNaN(progress) && isFinite(progress)) {
                progressBar.value = progress;
            }
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        progressBar.value = 0;
    });

    const player = document.getElementById('mp3-player');
    player.style.display = 'block';

    // Show welcome window on load
    setTimeout(() => {
        openWindow('welcome');
        // Position it in the center
        const welcomeWindow = document.getElementById('welcome-window');
        welcomeWindow.style.left = '50%';
        welcomeWindow.style.top = '50%';
        welcomeWindow.style.transform = 'translate(-50%, -50%)';
        welcomeWindow.style.width = '500px'; // Set a good default width
    }, 500); // Small delay to ensure smooth animation

    // Debounce function to limit rapid updates
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimize mousemove handler with debouncing
    const updateCursor = debounce((e) => {
        requestAnimationFrame(() => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });
    }, 5); // 5ms debounce time

    document.addEventListener('mousemove', updateCursor);

    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    // Show cursor when mouse enters window
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });

    // Cache hoverable elements and optimize hover handling
    const hoverableElements = document.querySelectorAll('.desktop-icon, .window-header, .close-btn, .clippy, .start-button');
    const cursorImg = cursor.querySelector('img');
    
    hoverableElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorImg.src = '/assets/handcursor.png';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorImg.src = '/assets/cursorwhitepng.png';
        });
    });

    audio.addEventListener('ended', () => {
        nextSong();
    });
});

let startMenuOpen = false;

document.querySelector('.start-button').addEventListener('click', () => {
    const startMenu = document.querySelector('.start-menu');
    startMenuOpen = !startMenuOpen;
    startMenu.style.display = startMenuOpen ? 'block' : 'none';
});

// Close start menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.start-menu') && !e.target.closest('.start-button')) {
        document.querySelector('.start-menu').style.display = 'none';
        startMenuOpen = false;
    }
});

// Add easter egg functionality
document.querySelectorAll('.start-menu-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        switch(index) {
            case 0: // Record message
                alert('🎤 *Static noise* Agent, this message will self-destruct in 5 seconds... Just kidding! 😄');
                break;
            case 1: // Barrel roll
                document.body.style.transition = 'transform 1s';
                document.body.style.transform = 'rotate(360deg)';
                setTimeout(() => {
                    document.body.style.transform = 'rotate(0deg)';
                }, 1000);
                break;
            case 2: // Secret files
                const messages = [
                    "ACCESS DENIED: Nice try! 😎",
                    "ERROR 404: Secrets not found... or are they? 🤔",
                    "SYSTEM MESSAGE: The secrets are actually in another castle! 🏰"
                ];
                alert(messages[Math.floor(Math.random() * messages.length)]);
                break;
        }
    });
});

// Add window resize handlers
const windows = document.querySelectorAll('.window');
windows.forEach(window => {
    const resizer = document.createElement('div');
    resizer.className = 'window-resizer';
    resizer.style.cssText = `
        width: 10px;
        height: 10px;
        background: #cccccc;
        position: absolute;
        right: 0;
        bottom: 0;
        cursor: se-resize;
    `;
    
    window.appendChild(resizer);
    
    let isResizing = false;
    let originalWidth;
    let originalHeight;
    let originalX;
    let originalY;
    
    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        originalWidth = window.offsetWidth;
        originalHeight = window.offsetHeight;
        originalX = e.clientX;
        originalY = e.clientY;
        
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });
    
    function resize(e) {
        if (isResizing) {
            const width = originalWidth + (e.clientX - originalX);
            const height = originalHeight + (e.clientY - originalY);
            
            if (width > 200) {
                window.style.width = width + 'px';
            }
            if (height > 150) {
                window.style.height = height + 'px';
            }
        }
    }
    
    function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }
});

function openWindow(id) {
    const window = document.getElementById(`${id}-window`);
    window.style.display = 'block';
    window.style.left = '50%';
    window.style.top = '50%';
    window.style.transform = 'translate(-50%, -50%)';
    
    if (activeWindow) {
        activeWindow.style.zIndex = '1';
        activeWindow.classList.remove('active');
    }
    window.style.zIndex = '2';
    window.classList.add('active');
    activeWindow = window;

    const header = window.querySelector('.window-header');
    header.addEventListener('mousedown', startDragging);
}

function closeWindow(id) {
    const window = document.getElementById(`${id}-window`);
    window.style.opacity = '0';
    window.style.transform = 'scale(0.7)';
    setTimeout(() => {
        window.style.display = 'none';
        window.style.opacity = '1';
        window.style.transform = 'scale(1)';
    }, 300);
}

function startDragging(e) {
    if (!isDragging) {
        isDragging = true;
        const window = e.target.closest('.window');
        activeWindow = window;
        
        if (activeWindow) {
            const windows = document.querySelectorAll('.window');
            windows.forEach(w => {
                w.style.zIndex = '1';
                w.classList.remove('active');
            });
            activeWindow.style.zIndex = '2';
            activeWindow.classList.add('active');
        }

        const rect = window.getBoundingClientRect();
        offset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

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
    const audio = document.getElementById('xp-audio');
    const songInfo = document.querySelector('.song-info');
    
    // Reset progress bar before loading new song
    progressBar.value = 0;
    
    audio.src = songs[index].src;
    songInfo.textContent = "Now Playing: " + songs[index].title;
    
    // Wait for metadata to load before playing
    audio.addEventListener('loadedmetadata', function onceLoaded() {
        audio.play();
        audio.removeEventListener('loadedmetadata', onceLoaded);
    });
}

function updateVolume(value) {
    const audio = document.getElementById('xp-audio');
    audio.volume = value;
}

function changeView(viewType) {
    const container = document.querySelector('.gallery-grid');
    if (viewType === 'thumbnails') {
        container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    } else {
        container.style.gridTemplateColumns = '1fr';
    }
}

let clippyMessages = [
    "Hi! I'm Clippy, your office assistant. It looks like you're exploring a portfolio. Would you like help with that?",
    "Need help navigating around? Try clicking on the desktop icons!",
    "Did you know you can drag windows around by their title bars?",
    "Want to contact the portfolio owner? Try clicking the Contact icon!",
    "Looking for technical skills? The Skills icon might be helpful!",
];

let currentMessageIndex = 0;

function clippySpeak() {
    const balloon = document.querySelector('.clippy-balloon');
    balloon.style.display = balloon.style.display === 'none' || !balloon.style.display ? 'block' : 'none';
    
    if (balloon.style.display === 'block') {
        balloon.textContent = clippyMessages[currentMessageIndex];
        currentMessageIndex = (currentMessageIndex + 1) % clippyMessages.length;
    }
}

setInterval(() => {
    const clippy = document.querySelector('.clippy');
    if (Math.random() < 0.3) {
        clippy.style.transform = `rotate(${(Math.random() - 0.5) * 20}deg)`;
        setTimeout(() => {
            clippy.style.transform = 'rotate(0deg)';
        }, 500);
    }
}, 5000);

function setupWindowBehavior() {
    const windows = document.querySelectorAll('.window');
    
    windows.forEach(window => {
        window.addEventListener('mousedown', () => {
            if (activeWindow) {
                activeWindow.style.zIndex = '1';
                activeWindow.classList.remove('active');
            }
            window.style.zIndex = '2';
            window.classList.add('active');
            activeWindow = window;
        });
    });
}