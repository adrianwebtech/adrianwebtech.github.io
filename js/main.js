var backgroundvid_aspect_ratio = 900 / 506;
var window_aspect_ratio = 0;

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