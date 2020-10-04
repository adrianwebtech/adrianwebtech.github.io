

/**************************************************************
Code execution when the web page has loaded completely
 *************************************************************/
gsap.registerPlugin(ScrollTrigger);

// Pace
Pace.on("start", function () {
    $("div.paceDiv").show();
});

Pace.on("done", function () {
    $("div.paceDiv").hide();
    $(document).ready(function () {


        $(".lang-switch-container .en-switch").hide();
        $(".lang-switch-container .zh-switch").show();

        // Scroll to top of page
        $(window).scrollTop(0);

        var lastScrollTop = 0;

        // Initialise object animation the objects with GSAP
        var inittl = gsap.timeline({ defaults: { duration: 3 } });
        var anim_lang = gsap.timeline({ defaults: { duration: 3 }, paused: true });

        var anim_scroll_2 = gsap.timeline({
            defaults: { duration: 3 },
            scrollTrigger: {
                trigger: "#slide-2",
                start: "top 80%",
                end: "+=500",
            }
        });

        var anim_scroll_3 = gsap.timeline({
            defaults: { duration: 3 },
            scrollTrigger: {
                trigger: "#slide-3",
                start: "top 80%",
                end: "+=500",
            }
        });

        // Add is-transitioning class to html when transition
        // Remove is-transitioning class from html when finish transition
        inittl.eventCallback("onStart", addTransitionClass);
        inittl.eventCallback("onComplete", removeTransitionClass);

        // Define animation during initial landing
        inittl.add(initAnimation());

        // Define animation during scroll trigger
        // anim_scroll_2.add(animateUponScroll(2));
        // anim_scroll_3.add(animateUponScroll(3));

        // Define animation when language switcher
        anim_lang.add(animateUponLangSwitch());

        // Animation during language switch
        var currslide = $("body").data();

        // English language switcher
        $(".lang-switch-container .en-switch").click(function () {
            $(".lang-switch-container .en-switch").hide("fast");
            $(".lang-switch-container .zh-switch").show("fast");
            $("body").addClass("en-lang");
            $("body").removeClass("zh-lang");

            anim_lang.reverse();
        })

        // Chinese language switcher
        $(".lang-switch-container .zh-switch").click(function () {
            $(".lang-switch-container .zh-switch").hide("fast");
            $(".lang-switch-container .en-switch").show("fast");
            $("body").addClass("zh-lang");
            $("body").removeClass("en-lang");

            anim_lang.play();
        })
    });
});



function addTransitionClass() {
    $('html').addClass("is-transitioning");
}

function removeTransitionClass() {
    $('html').removeClass("is-transitioning");
    $('body').css("overflow", 'visible');
}

function animateUponLangSwitch() {
    var tl1 = gsap.timeline();


    tl1.to("#slide-1 .invitation-text.en, #slide-1 .couple-names.en, #slide-1 .wedding-date.en, #slide-1 .wedding-place.en, #slide-2 .invitation-text.en, #slide-2 .wedding-flow.en, #slide-2 .rsvp.en, #slide-2 .contact-container .contact-button a span.en, #slide-3 .groom-name.en, #slide-3 .groom-quotes.en, #slide-4 .bride-name.en, #slide-4 .bride-quotes.en", { duration: 1, x: 100, autoAlpha: 0, display: 'none' })
        .fromTo("#slide-1 .invitation-text.zh, #slide-1 .couple-names.zh, #slide-1 .wedding-date.zh, #slide-1 .wedding-place.zh, #slide-2 .invitation-text.zh, #slide-2 .wedding-flow.zh, #slide-2 .rsvp.zh, #slide-2 .contact-container .contact-button a span.zh, #slide-3 .groom-name.zh, #slide-3 .groom-quotes.zh, #slide-4 .bride-name.zh, #slide-4 .bride-quotes.zh", { x: -100, autoAlpha: 0, display: 'none' }, { x: 0, autoAlpha: 1, duration: 1, display: 'block' })

    return tl1;
}

function initAnimation() {
    var tl = gsap.timeline({ defaults: { duration: 3 } });
    // tl.fromTo("#loader-love-1", { scale: 0, opacity: 1 }, { scale: 20, opacity: 0, duration: 8, ease: "back.out(2)" })
    //     .fromTo("#loader-love-2", { scale: 0, opacity: 1 }, { scale: 20, opacity: 0, duration: 8, ease: "back.out(2)" }, '-=7.5')
    //     .fromTo("#loader-love-3", { scale: 0, opacity: 1 }, { scale: 20, opacity: 0, duration: 8, ease: "back.out(2)" }, '-=7.9')
    //     .fromTo("#loader-love-4", { scale: 0, opacity: 1 }, { scale: 20, opacity: 0, duration: 8, ease: "back.out(2)" }, '-=7.5')
    tl.from("#slide-1 .half-overlay, #slide-1-fade-img-1", { x: -400, opacity: 0 })
        .from("#slide-1-fade-img-2", { x: 400, opacity: 0 }, '-=1' )
        .from("#slide-1 .main-img", { scale: 0, opacity: 0, ease: "back.out(2)" }, '-=0.5')
        .from("#slide-1 .main-decoration-banner", { duration: 1.5, scale: 2.5, opacity: 0 }, '-=1.5')
        .from("#slide-1 .invitation-text.en", { duration: 1, y: 50, opacity: 0 }, '-=1.5')
        .from("#slide-1 .couple-names.en", { duration: 1, x: 130, y: 100, rotate: 180, opacity: 0 }, '-=1.5')
        .from("#slide-1 .wedding-date.en", { duration: 2, y: 100, opacity: 0, ease: "power2.out" }, '-=1.5')
        .from("#slide-1 .wedding-place.en", { duration: 2, y: 100, opacity: 0, ease: "power2.out" }, '-=1.5')

    return tl;
}

// Deprecated
function animateUponScroll(slidenum) {
    var tl = gsap.timeline({ defaults: { duration: 3 } });

    if (slidenum == 3) {
        tl.from("#slide-3 .main-img", { scale: 0, opacity: 0, ease: "back.out(2)" })
            .from("#slide-3 .main-decoration-banner", { rotate: 560, autoAlpha: 0, x: 500 }, "-=2.5")
            .from("#slide-3 .surround-decoration-banner", { duration: 1.5, autoAlpha: 0, y: 500 }, "-=1.5")
            .from("#slide-3 .groom-name", { duration: 1.5, autoAlpha: 0, scale: 3, }, "-=1.5")
            .from("#slide-3 .groom-quotes", { duration: 1, autoAlpha: 0, y: 200 })
    }
    else if (slidenum == 2) {
        tl.from("#slide-2 .main-img", { x: -500, autoAlpha: 0 })
            .from("#slide-2 .translucent-overlay", { x: 500, autoAlpha: 0 }, "-=1.5")
            .from("#slide-2 .surround-decoration-banner img", { x: -500, autoAlpha: 0 }, "-=1.5")
            .from("#slide-2 .invitation-text, #slide-2 .map, #slide-2 .address, #slide-2 .contact-container", { y: 10, autoAlpha: 0, ease: "back.out(1)" });
    }

    return tl;
}