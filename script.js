// profile pic zoom
document.querySelector('a.navbar-brand img').addEventListener('click', function() {
  var myModal = new bootstrap.Modal(document.getElementById('profilePicModal'), {
    keyboard: true
  });
  myModal.show();
});

document.addEventListener('DOMContentLoaded', () => {
    // Select all video players with the class .js-player
    const videoPlayers = document.querySelectorAll('.js-player');

    // Initialize each video player separately
    videoPlayers.forEach(player => {
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
                    console.log(`Quality changed to ${newQuality}`);
                    updateVideoSource(newQuality, player);
                }
            }
        });
    });

    // Set quality
    function updateVideoSource(quality, videoElement) {
        const sources = videoElement.querySelectorAll('source');
        let newSource;

        sources.forEach(source => {
            if (source.getAttribute('data-quality') == quality) {
                newSource = source;
            }
        });
       
        if (newSource) {
            // Set the new video source
            videoElement.src = newSource.src;
            videoElement.load();
            videoElement.play();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('.js-player');
    videos.forEach((video) => {
        const overlay = video.closest('.video-container').querySelector('.loading-overlay');

        // Show overlay on buffering
        video.addEventListener('waiting', () => {
            overlay.style.display = 'flex';
        });

        // Hide overlay on play
        video.addEventListener('playing', () => {
            overlay.style.display = 'none';
        });

        // Hide overlay on pause
        video.addEventListener('pause', () => {
            overlay.style.display = 'none';
        });

        // Only allow one video to play at a time
        video.addEventListener('play', () => {
            videos.forEach((otherVideo) => {
                if (otherVideo !== video) {
                    otherVideo.pause();
                }
            });
        });

        // Pause video if clicked outside
        const pauseOnClickOutside = (event) => {
            if (!video.contains(event.target)) {
                video.pause();
                document.removeEventListener('click', pauseOnClickOutside); // Remove the listener when paused
            }
        };

        // Add click listener on play, remove on pause
        video.addEventListener('play', () => {
            document.addEventListener('click', pauseOnClickOutside);
        });
        video.addEventListener('pause', () => {
            document.removeEventListener('click', pauseOnClickOutside);
        });
    });
    
    // Pause the video when click tab
    document.querySelectorAll('a[data-bs-toggle="pill"]').forEach((tab) => {
        tab.addEventListener('shown.bs.tab', () => {
            videos.forEach((video) => video.pause());
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const homeTab = document.querySelector('a[href="#home"]');
    const homeContent = document.getElementById('home');

    homeTab.addEventListener('click', () => {
        if (homeContent.classList.contains('active')) {
            homeContent.classList.remove('fade-in');
            void homeContent.offsetWidth; // animation
            homeContent.classList.add('fade-in');
        }
    });
});
