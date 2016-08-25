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

    $(document).ready(function() {

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


    });

    // Do stuff on window load - Strict
    $(window).load(function() {
        FastClick.attach(document.body); // Warning can be ignored

        // Store SVG container element as variable
        var layoutBox = document.querySelectorAll(".layout-box"),
            xPos = 0,
            yPos = 0,
            elOver = true,
            clicked = false,
            rect,
            coords;

        CSSPlugin.useSVGTransformAttr = true;

        function moveMask(valueX, valueY) {
            [].slice.call(layoutBox).forEach(function(el, i) {

                var svgContainer = el.querySelectorAll('.svg-container');
                var svgContainerLeft = el.querySelectorAll('.left');
                var svgContainerBottom = el.querySelectorAll('.bottom');
                var mask = el.querySelectorAll('.mask');
                var circle = el.querySelectorAll('.circle');

                // Container 3d push effect 
                var tlContainer3d = new TimelineMax({
                    paused: true
                });
                tlContainer3d.to(svgContainer, 0.3, {
                    x: "-=4px",
                    y: "+=4px"
                });
                el.animationContainer3d = tlContainer3d;
                tlContainer3d.progress(1).progress(0);

                // Container 3d push effect left
                var tlContainer3dLeft = new TimelineMax({
                    paused: true
                });
                tlContainer3dLeft.to(svgContainerLeft, 0.3, {
                    width: "6px"
                });
                el.animationContainer3dLeft = tlContainer3dLeft;
                tlContainer3dLeft.progress(1).progress(0);

                // Container 3d push effect bottom
                var tlContainer3dBottom = new TimelineMax({
                    paused: true
                });
                tlContainer3dBottom.to(svgContainerBottom, 0.3, {
                    height: "6px",
                    right: "+=4px"
                });
                el.animationContainer3dBottom = tlContainer3dBottom;
                tlContainer3dBottom.progress(1).progress(0);

                // Mask move animation
                var tlMove = new TimelineMax({
                    paused: true
                });
                tlMove.to(mask, 0.01, {
                    ease: Linear.easeNone,
                    x: valueX + "px",
                    y: valueY + "px"
                });
                el.animationMaskMove = tlMove;
                tlMove.progress(1).progress(0);

                // Mask click animation
                var tlClick = new TimelineMax({
                    paused: true
                });
                tlClick.to(circle, 0.4, {
                    z: 0.1,
                    rotationZ: 0.01,
                    ease: Linear.easeNone,
                    force3D: true,
                    attr: {
                        r: 1000
                    }
                });
                el.animationMaskClick = tlClick;
                tlClick.progress(1).progress(0);

                // Mask leave animation
                var tlLeave = new TimelineMax({
                    paused: true
                });
                tlLeave.to(circle, 0.2, {
                    attr: {
                        r: 500
                    }
                });
                el.animationMaskLeave = tlLeave;
                tlLeave.progress(1).progress(0);

                // Mask slow leave animation
                var tlLeaveSlow = new TimelineMax({
                    paused: true
                });
                tlLeaveSlow.to(circle, 1, {
                    ease: Bounce.easeOut,
                    attr: {
                        r: 500
                    }
                });
                el.animationMaskSlowLeave = tlLeaveSlow;
                tlLeaveSlow.progress(1).progress(0);

                // Mask mouseover animation
                var tlOver = new TimelineMax({
                    paused: true
                });
                tlOver.to(circle, 0.15, {
                    z: 0.1,
                    rotationZ: 0.01,
                    ease: Linear.easeNone,
                    force3D: true,
                    attr: {
                        r: 450
                    }
                });
                el.animationMaskOver = tlOver;
                tlOver.progress(1).progress(0);

            });
        }

        // Run function so that animation (progress trick) can be cached
        moveMask();

        function play() {
            for (var x = 0; x < layoutBox.length; x++) {
                // Add event listener to mouse over state
                layoutBox[x].addEventListener("mousemove", function(e) {
                    if (elOver) {
                        // Get coordinates of container
                        rect = this.getBoundingClientRect();
                        xPos = e.pageX - rect.left;
                        yPos = e.pageY - rect.top - window.scrollY;

                        // Add coordinates to array and pass in to moveMask function
                        coords = [xPos, yPos];
                        moveMask.apply(null, coords);
                        this.animationMaskMove.play();
                    }
                });

                // Add event listener to mouse down
                layoutBox[x].addEventListener("mousedown", function(e) {
                    this.animationContainer3d.play();
                    this.animationContainer3dLeft.play();
                    this.animationContainer3dBottom.play();
                    this.animationMaskClick.play();
                    clicked = true;
                    elOver = false;
                });

                // Add event listener to mouse over
                layoutBox[x].addEventListener("mouseover", function(e) {
                    if (elOver) {
                        this.animationMaskOver.play();
                    }
                });

                // Add event listener to mouse leave - Slow animation is already clicked
                layoutBox[x].addEventListener("mouseleave", function(e) {
                    this.animationContainer3d.reverse();
                    this.animationContainer3dLeft.reverse();
                    this.animationContainer3dBottom.reverse();
                    if (clicked) {
                        this.animationMaskSlowLeave.play();
                    } else {
                        this.animationMaskLeave.play();
                    }
                    clicked = false;
                    elOver = true;
                });

            }
        }
        play();
    });

}());

// Do stuff instantly
(function() {
    // this anonymous function is sloppy...
}());
