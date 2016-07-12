// Strict Mode is a new feature in ECMAScript 5 that allows you to place a program, or a function, in a "strict" operating context.
// This strict context prevents certain actions from being taken and throws more exceptions.
// And:

// Strict mode helps out in a couple ways:

// It catches some common coding bloopers, throwing exceptions.
// It prevents, or throws errors, when relatively "unsafe" actions are taken (such as gaining access to the global object).
// It disables features that are confusing or poorly thought out.

// When the below is set to true, the comment below enables use strict globally

/*jshint strict: false */

(function() {
    'use strict';
    // this anonymous function is strict...;

    // Add classes to lazy loaded elements for transitions
    window.lazySizesConfig = {
        addClasses: true
    };

    $(document).ready(function() {

        // Mobile Menu
        var $menu = $('.menu').first().clone();
        var $body = $('body');
        $menu.appendTo('.mobmen-container').addClass('mobmen');
        $body.prepend('<div class="body-overlay"></div>');
        var $mobMenu = $('.mobmen');
        var $navIcon = $('.nav-icon');
        var $bodyOverlay = $('.body-overlay');


        $navIcon.on('click', function() {
            $navIcon.toggleClass('nav-icon-go');
            $mobMenu.toggleClass('mob-menu-go');
            $bodyOverlay.toggleClass('active');
            $body.toggleClass('overflow');
        });

        // Resize delay
        var rtime = new Date(946728000);
        var timeout = false;
        var delta = 200;
        $(window).resize(function() {
            rtime = new Date();
            if (timeout === false) {
                timeout = true;
                setTimeout(resizeend, delta);
            }
        });

        function resizeend() {
            if (new Date() - rtime < delta) {
                setTimeout(resizeend, delta);
            } else {
                timeout = false;
                fixnav();
            }
        }

        // Get accordion <p> element height and set CSS
        var $accordionEl = $('.accordion p');
        $accordionEl.each(function() {
            var height = $(this).height();
            $(this).css('max-height', height + 24);
        });

        // Listen for orientation changes
        window.addEventListener("orientationchange", function() {
            // Do stuff
        }, false);

        // Fixed position navigation bar when user scrolls below #navbar
        function fixnav() {
            var $navBar = $('#navbar');
            if ($(window).width() < 768) {
                // Store the position of the element in position
                var $position = $($navBar).offset();

                // On scrolling of the document do something
                $(document).scroll(function() {
                    // The current height
                    var $yPos = $(this).scrollTop();

                    // If the current Y is bigger than the element. (you scrolled beyond the element)
                    if ($yPos >= $position.top) {
                        $navBar.addClass('fixed');
                    } else {
                        $navBar.removeClass('fixed');
                    }
                });
                var $yPos = $(document).scrollTop();

                // If the current Y is bigger than the element. (you scrolled beyond the element)
                if ($yPos >= $position.top) {
                    $navBar.addClass('fixed');
                } else {
                    $navBar.removeClass('fixed');
                }
            } else {
                $navBar.removeClass('fixed');
            }
        }
        fixnav();

        // Drop down menu fix for - double tap issue on touch devices
        /* $('.site-header a').on('click touchend', function() {
            var $el = $(this);
            var link = $el.attr('href');
            window.location = link;
        }); */

        // Detect touch device
        var preliminaryTouch = false;
        $('body').addClass('no-touch-device');
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            preliminaryTouch = true;
        }
        if (preliminaryTouch) {
            $('body').addClass('is-touch-device');
        }

        // Skill Switch - gets list elements and adds to array
        var array = $('#skills li').map(function() {
            return $.trim($(this).text());
        }).get();

        // GSAP Animations
        var box = $("#skill-switch");
        var delay = 1.5;

        var tl = new TimelineLite({
            onComplete: function() {
                this.restart();
            }
        });

        tl.to(box, .75, { text: array[0], delay: delay, ease: Linear.easeNone })
            .to(box, .5, { text: array[1], delay: delay, ease: Linear.easeNone })
            .to(box, 1, { text: array[2], delay: delay, ease: Linear.easeNone })
            .to(box, 1.5, { text: array[3], delay: delay, ease: Linear.easeNone })
            .to(box, 1, { text: array[4], delay: delay, ease: Linear.easeNone })
            .to(box, 1, { text: array[5], delay: delay, ease: Linear.easeNone })

        // SVG Skills Morph
        TweenLite.set('#laptop', {
            visibility: 'visible'
        });
        var tl = new TimelineMax()
            .staggerFrom('#laptop', 0, {
                scale: 1,
                opacity: 1,
                transformOrigin: "50% 50%"
            }, 0)
            .staggerTo(['#laptop'], 0.5, {
                opacity: 1,
                fill: "#FFC107",
                scale: .25,
                morphSVG: '#css3',
                delay: .3,
                shapeIndex: -7
            }, .25, 'logo')
            .staggerFrom(['#css-tech'], .25, {
                opacity: 1,
                x: '+80',
                ease: Sine.easeIn
            }, 0.15, 'logo')

        $('.svg-container').hover(function() {
            tl.tweenTo('logo')
        }, function() {
            tl.play()
        });

        /* TweenLite.to("#css3", 1, {
          morphSVG: {
            shape: "#laptop",
            shapeIndex: 1
          }
        }); */
        //comment out next line to disable findShapeIndex() UI
        //findShapeIndex("#css3", "#laptop");

    });

    // Do stuff on window load - Strict
    $(window).load(function() {
        FastClick.attach(document.body); // Warning can be ignored
    });

}());

// Do stuff instantly
(function() {
    // this anonymous function is sloppy...
}());
