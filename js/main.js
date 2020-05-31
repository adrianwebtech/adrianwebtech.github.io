var backgroundvid_aspect_ratio = 900 / 506;
var window_aspect_ratio = 0;

/**************************************************************
For youtube iframe initialisation using Youtube Iframe API
 *************************************************************/
var w = $(window).width();
var h = $(window).height();
var player;

// Set width and height of initial iframe
window_aspect_ratio = $(window).width() / $(window).height();
if (window_aspect_ratio > backgroundvid_aspect_ratio) {
    w = $(window).width() * 2;
    h = $(window).width() / backgroundvid_aspect_ratio;
}
else {
    w = $(window).height() * 2 * backgroundvid_aspect_ratio;
    h = $(window).height();
}

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: h.toString(),
        width: w.toString(),
        videoId: 'lRTtMcx6rSM',
        playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: 'lRTtMcx6rSM',
        },
        events: {
            'onReady': onPlayerReady,
        }
    });
}

// When player is ready, check for initial window size
// Stop video when it is less than 768px (tablet/mobile size)
function onPlayerReady(event) {
    if ($(window).width() < 768) {
        $(".video-container iframe").hide();
    }
}


/**************************************************************
Code execution when the web page has loaded completely
 *************************************************************/
$(document).ready(function () {
    /***************************************
    Preloader
    ****************************************/
    preloaderFadeOutTime = 1000;
    function hidePreloader() {
        var preloader = $('.spinner-wrapper');
        preloader.fadeOut(preloaderFadeOutTime);
    }

    hidePreloader();

    /***************************************
    Code trigger when resizing the browser
    ****************************************/
    $(window).resize(function () {
        // This will fire each time the window is resized:
        window_aspect_ratio = $(window).width() / $(window).height();
        $(".video-container").css("width", $(window).width());

        // Resize the video background iframe according to aspect ratio
        if (window_aspect_ratio > backgroundvid_aspect_ratio) {
            $(".video-container iframe").css("width", $(window).width() * 2);
            $(".video-container iframe").css("height", $(window).width() / backgroundvid_aspect_ratio);
        }
        else {
            $(".video-container iframe").css("width", $(window).height() * 2 * backgroundvid_aspect_ratio);
            $(".video-container iframe").css("height", $(window).height());
        }

        // Fall back to picture background if less than certain size
        // Stop the video
        if ($(window).width() < 768) {
            $(".video-container iframe").hide();
        }
        else {
            $(".video-container iframe").show();
        }

    }).resize();

    /***************************************
    For initialisation of owl carousel
    ****************************************/
    $(".owl-carousel").owlCarousel({
        autoplay: false,
        autoplayHoverPause: true,
        items: 1,
        smartSpeed: 450,
        nav: true,
        dots: true,
        loop: true,
        animateIn: 'flipInX',
        animateOut: 'zoomOutDown'
    })

    /***************************************
    Animate on scroll
    ****************************************/
    AOS.init();

    /***************************************
    Scroll to ID
    ****************************************/
    $(".nav-link, #scrolltotop a, #intro-know-more a").click(function () {
        var sectionscroll = '#'.concat($(this).data("section-scroll"));
        $("body, html").animate({
            scrollTop: $(sectionscroll).offset().top,
        }, 1000);
    });
});