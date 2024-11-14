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
                default: 1080, // Default quality
                options: [1080, 720, 480], // Available options
                forced: true, // Forces the available options to just 1080p or 720p or 480p
                onChange: (newQuality) => {
                    console.log(`Quality changed to ${newQuality}`);
                    updateVideoSource(newQuality, player); // Update the source for this specific player
                }
            }
        });
    });

    // Function to update the video source based on selected quality
    function updateVideoSource(quality, videoElement) {
        const sources = videoElement.querySelectorAll('source');
        let newSource;

        // Find the source element that matches the selected quality
        sources.forEach(source => {
            if (source.getAttribute('data-quality') == quality) {
                newSource = source;
            }
        });
        // Update the video source if a matching one was found
        if (newSource) {
            // Set the new video source
            videoElement.src = newSource.src;
            videoElement.load();
            videoElement.play(); // Play the video immediately after source change
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

        // Pause video if clicked outside of it
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
