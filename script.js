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
});

document.querySelectorAll('.js-player').forEach(video => {
    const overlay = video.closest('.video-container').querySelector('.loading-overlay');

    // Show the overlay when buffering starts
    video.addEventListener('waiting', () => {
        overlay.style.display = 'flex';
    });

    // Hide the overlay when the video starts playing
    video.addEventListener('playing', () => {
        overlay.style.display = 'none';
    });

    // Hide the overlay when the video pauses (useful if you want to stop showing it on pause)
    video.addEventListener('pause', () => {
        overlay.style.display = 'none';
    });
});

document.querySelectorAll('a[data-bs-toggle="pill"]').forEach(function(tab) {
    tab.addEventListener('shown.bs.tab', function() {
        const video = document.querySelector('.js-player');
        video.pause();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('.js-player');
    
    videos.forEach((video) => {
        video.addEventListener('play', () => {
            videos.forEach((otherVideo) => {
                if (otherVideo !== video) {
                    otherVideo.pause();
                }
            });
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Get all video elements
    const videos = document.querySelectorAll('.js-player');

    videos.forEach((video) => {
        // Add a play event listener to each video
        video.addEventListener('play', () => {
            // Add a click event listener to the document
            document.addEventListener('click', (event) => {
                // Check if the click happened outside the currently playing video
                if (!video.contains(event.target)) {
                    video.pause();
                }
            }, { once: true }); // Ensure this event is only triggered once per play
        });
    });
});
