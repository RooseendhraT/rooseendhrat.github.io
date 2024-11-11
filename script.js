document.addEventListener('DOMContentLoaded', () => {
    const players = Plyr.setup('.js-player', {
        quality: {
            default: 1080,
            options: [1080, 720, 480],
            forced: true,
            onChange: (newQuality) => {
                console.log(`Quality changed to ${newQuality}`);
            }
        }
    });

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

    /* Pause the video when switching tabs
    document.querySelectorAll('a[data-bs-toggle="pill"]').forEach((tab) => {
        tab.addEventListener('shown.bs.tab', () => {
            videos.forEach((video) => video.pause());
        });
    });*/
});
document.addEventListener('DOMContentLoaded', () => {
    const homeTab = document.querySelector('a[href="#home"]');
    const homeContent = document.getElementById('home');

    homeTab.addEventListener('click', (event) => {
        if (homeContent.classList.contains('active')) {
            homeContent.classList.remove('fade-in'); // Remove existing animation class
            void homeContent.offsetWidth; // Trigger reflow to restart the animation
            homeContent.classList.add('fade-in'); // Reapply animation class
        }
    });
});
