document.addEventListener('DOMContentLoaded', () => {
    // Fetch the JSON file and dynamically generate video elements
    fetch('data/videos.json')
        .then(response => response.json())
        .then(videos => {
            const container = document.querySelector('#videos .row'); // Selector for videos tab

            videos.forEach(video => {
                const card = document.createElement('div');
                card.className = 'col-sm-4 pt-3';

                card.innerHTML = `
                    <div class="card">
                        <div class="video-container position-relative">
                            <div class="loading-overlay" style="display:none;"><div class="spinner"></div></div>
                            <video class="js-player" preload="none" poster="${video.poster}" controls>
                                <source src="${video.sources[1080]}" type="video/mp4" data-quality="1080">
                                <source src="${video.sources[720]}" type="video/mp4" data-quality="720">
                                <source src="${video.sources[480]}" type="video/mp4" data-quality="480">
                                Your browser does not support the video tag.
                            </video>
                            <div class="d-flex justify-content-between align-items-center p-2">
                                <div class="caption">
                                    <p>${video.title}</p>
                                </div>
                                    <div class="dropdown">
                                        <button class="btn btn-outline-dark btn-sm dropdown-toggle" type="button" id="downloadDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="fas fa-download"></i>
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="downloadDropdown">
                                            <li><a class="dropdown-item" href="${video.sources[1080]}" download>1080p</a></li>
                                            <li><a class="dropdown-item" href="${video.sources[720]}" download>720p</a></li>
                                            <li><a class="dropdown-item" href="${video.sources[480]}" download>480p</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                container.appendChild(card);
            });

            // Reinitialize video players after dynamic content is loaded
            initializeVideoPlayers();
        })
        .catch(err => console.error('Error loading videos:', err));
});

// Initialize video players with Plyr.js
function initializeVideoPlayers() {
    const videoPlayers = document.querySelectorAll('.js-player');

    videoPlayers.forEach(player => {
        const overlay = player.closest('.video-container').querySelector('.loading-overlay');

        new Plyr(player, {
            controls: [
                'play-large',
                'play',
                'current-time',
                'progress',
                'duration',
                'settings',
                'fullscreen'
            ],
            settings: ['quality'],
            quality: {
                default: 1080,
                options: [1080, 720, 480],
                forced: true,
                onChange: (newQuality) => {
                    updateVideoSource(newQuality, player);
                }
            }
        });

        // Show overlay when video is buffering
        player.addEventListener('waiting', () => {
            overlay.style.display = 'flex';
        });

        // Hide overlay when video is ready
        player.addEventListener('canplay', () => {
            overlay.style.display = 'none';
        });

        // Ensure videos do not autoplay
        player.addEventListener('loadedmetadata', () => {
            player.pause();
        });

        // Only allow one video to play at a time
        player.addEventListener('play', () => {
            videoPlayers.forEach(otherPlayer => {
                if (otherPlayer !== player) {
                    otherPlayer.pause();
                }
            });
        });
    });

    // Pause videos when switching tabs
    document.querySelectorAll('a[data-bs-toggle="pill"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', () => {
            videoPlayers.forEach(player => player.pause());
        });
    });
}

// Update video source when quality changes
function updateVideoSource(quality, videoElement) {
    const sources = videoElement.querySelectorAll('source');
    let newSource;

    sources.forEach(source => {
        if (source.getAttribute('data-quality') == quality) {
            newSource = source;
        }
    });

    if (newSource) {
        videoElement.src = newSource.src;
        videoElement.load();
        videoElement.play();
    }
}

// Profile picture zoom
document.querySelector('a.navbar-brand img').addEventListener('click', function() {
    const myModal = new bootstrap.Modal(document.getElementById('profilePicModal'), {
        keyboard: true
    });
    myModal.show();
});
