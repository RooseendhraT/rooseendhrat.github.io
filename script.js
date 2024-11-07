const players = Plyr.setup('.js-player',{
    quality: {
        default:1080,
        options:[1080,720,480],
        forced:true,
        onchange: (newQuality)=>{
            console.log(`Quality changed to ${newQuality}`)
        }
    }
});

document.querySelectorAll('a[data-bs-toggle="pill"]').forEach(function(tab) {
    tab.addEventListener('shown.bs.tab', function() {
        // Pause the video when switching tabs
        const video = document.querySelector('.js-player');
        video.pause();
    });
});
