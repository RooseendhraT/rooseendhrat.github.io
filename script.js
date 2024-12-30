document.addEventListener('DOMContentLoaded', () => {
    // Fetch the JSON file and dynamically generate video elements
    fetch('data/videos.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load videos.json');
            return response.json();
        })
        .then(videos => {
            const container = document.querySelector('#videos .row'); // Selector for videos tab
            if (!container) {
                console.error('Container for videos not found');
                return;
            }

            videos.forEach(video => {
                const card = document.createElement('div');
                card.className = 'col-sm-4 pt-3';

                card.innerHTML = `
                    <div class="card">
                        <div class="video-container position-relative">
                            <div class="loading-overlay" style="display:none;">
                                <div class="spinner"></div>
                            </div>
                            <video class="js-player" preload="metadata" poster="${video.poster}" controls>
                                <source src="${video.sources[1080]}" type="video/mp4" data-quality="1080">
                                Your browser does not support the video tag.
                            </video>
                            <div class="d-flex justify-content-between align-items-center p-2">
                                <div class="caption align-items-centre">
                                    <p>${video.title}</p>
                                </div>
                                <div class="dropdown">
                                    <a class="btn btn-outline-dark btn-sm download-btn" href="${video.sources[1080]}" download="${video.title}.mp4">
                                        <i class="fas fa-download"></i>
                                        <i class="download-spinner spinner-border spinner-border-sm text-dark fs-4" style="display: none;"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                container.appendChild(card);
            });

            // Reinitialize video players after dynamic content is loaded
            initializeVideoPlayers();

            // Attach event listeners for download buttons
            attachDownloadHandlers();
        })
        .catch(err => console.error('Error loading videos:', err.message));
});

function attachDownloadHandlers() {
    document.addEventListener('click', event => {
        const downloadBtn = event.target.closest('.download-btn');
        if (downloadBtn) {
            // Hide the download icon and show the spinner
            const downloadIcon = downloadBtn.querySelector('.fas.fa-download');
            const downloadSpinner = downloadBtn.querySelector('.download-spinner');
            if (downloadIcon && downloadSpinner) {
                downloadIcon.style.display = 'none';
                downloadSpinner.style.display = 'inline-block';
            }

            // Hide spinner and restore download icon after 1 second
            setTimeout(() => {
                if (downloadIcon && downloadSpinner) {
                    downloadIcon.style.display = 'inline-block';
                    downloadSpinner.style.display = 'none';
                }
            }, 1000);
        }
    });
}

// Initialize video players with Plyr.js
function initializeVideoPlayers() {
    const videoPlayers = document.querySelectorAll('.js-player');

    videoPlayers.forEach(player => {
        const overlay = player.closest('.video-container')?.querySelector('.loading-overlay');

        // Initialize Plyr.js
        const plyrInstance = new Plyr(player, {
            controls: [
                'play-large',
                'play',
                'current-time',
                'progress',
                'duration',
                'fullscreen'
            ],
        });

        // Show overlay when video is buffering
        player.addEventListener('waiting', () => {
            if (overlay) overlay.style.display = 'flex';
        });

        // Hide overlay when video is ready
        player.addEventListener('canplay', () => {
            if (overlay) overlay.style.display = 'none';
        });

        // Only allow one video to play at a time
        player.addEventListener('play', () => {
            videoPlayers.forEach(otherPlayer => {
                if (otherPlayer !== player) {
                    otherPlayer.pause();
                }
            });
        });

        // Remove 'preload' limitation for first play
        player.addEventListener('click', () => {
            if (player.preload === 'metadata') {
                player.preload = 'auto'; // Load the video fully upon interaction
                player.load(); // Ensure the video is ready
            }
        });

        // Toggle play/pause on video click
        player.addEventListener('click', (event) => {
            if (player.paused) {
                player.play();
            } else {
                player.pause();
            }
        });
    });

    // Pause videos when switching tabs
    document.querySelectorAll('a[data-bs-toggle="pill"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', () => {
            videoPlayers.forEach(player => player.pause());
        });
    });
}

// Profile picture zoom
const navbarBrandImg = document.querySelector('a.navbar-brand img');
if (navbarBrandImg) {
    navbarBrandImg.addEventListener('click', function () {
        const myModal = new bootstrap.Modal(document.getElementById('profilePicModal'), {
            keyboard: true,
        });
        myModal.show();
    });
} else {
    console.warn('Navbar brand image not found.');
}
