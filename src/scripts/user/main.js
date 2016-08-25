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
    // Store SVG container element as variable
    var box = document.querySelectorAll(".box");

    // Text Effect
    var split = document.querySelectorAll('.words h2, .words h3, .words p, .words li');
    var tlSplitText = new TimelineMax({
            onCompleteAll: function() {
                mySplitText.revert()
            }
        }),
        mySplitText = new SplitText(split, {
            type: "chars"
        }),
        chars = mySplitText.chars; // an array of all the divs that wrap each character

    TweenMax.set(split, {
        perspective: 400
    });
    tlSplitText.staggerFrom(chars, 0.4, {
        opacity: 0,
        scale: 0,
        y: 80,
        rotationX: 180,
        transformOrigin: "0% 50% -50",
        ease: Back.easeOut
    }, 0.01, "+=0");
    tlSplitText.progress(1).progress(0);

    // GSAP tweens/functions that require access to coordinates
    function moveMask(el, valueX, valueY) {
        var img = el.querySelectorAll('.img');

        // Mask move animation
        var tlMove = new TimelineMax({
            paused: true
        });
        tlMove.set(img, {
            webkitClipPath: '40px at ' + valueX + 'px ' + valueY + 'px'
        });
        el.animationMaskMove = tlMove;

        // Mask click animation
        var tlClick = tlLeave = new TimelineMax({
            paused: true
        });
        tlClick.to(img, 0.8, {
            webkitClipPath: '500px at ' + valueX + 'px ' + valueY + 'px',
        });
        tlClick.to(img, 0.4, {
            '-webkit-filter': 'grayscale(0%)',
             filter: 'grayscale(0%)'
        }, '-=0.8');
        el.animationMaskClick = tlClick;
        tlClick.progress(1).progress(0); // Forces an initial render of this tween so that it's cached for its 2nd usage

        // Mask leave animation
        var tlLeave = new TimelineMax({
            paused: true
        });
        tlLeave.to(img, 0.2, {
            webkitClipPath: '0 at ' + valueX + 'px ' + valueY + 'px',
            '-webkit-filter': 'grayscale(100%)',
             filter: 'grayscale(100%)'
        });
        el.animationMaskLeave = tlLeave;
        tlLeave.progress(1).progress(0);

        // Mask slow leave animation
        var tlLeaveSlow = new TimelineMax({
            paused: true
        });
        tlLeaveSlow.to(img, 0.7, {
            ease: Bounce.easeOut,
            webkitClipPath: '0 at ' + valueX + 'px ' + valueY + 'px',
            '-webkit-filter': 'grayscale(100%)',
             filter: 'grayscale(100%)'
        });
        el.animationMaskSlowLeave = tlLeaveSlow;
        tlLeaveSlow.progress(1).progress(0);

    }

    // Force initial run with temporary coordinates (so tweens can be cached)
    [].forEach.call(box, function(el, i) {
        moveMask(el, -100, -100)
    });

    // GSAP tweens/functions that don't access to coordinates
    [].forEach.call(box, function(el, i) {
        // .box
        var svgContainer = el.querySelectorAll('.svg-container');
        var svgContainerLeft = el.querySelectorAll('.box .left');
        var svgContainerBottom = el.querySelectorAll('.box .bottom');
        // .reveal
        var img = el.querySelectorAll('.reveal-box .img');
        var mask = el.querySelectorAll('.reveal-box .mask');
        var text = el.querySelectorAll('.reveal-box .text');
        var elSplit = el.querySelectorAll('.reveal-box .words');
        // .skills
        var logo = el.querySelectorAll('.skills-box .logo');
        var svg = el.querySelectorAll('.skills-box svg');
        var text = el.querySelectorAll('.skills-box h2');
        var list = el.querySelectorAll('.skills-box ul li');

        // .box
        // Container 3d push effect 
        var tlContainer3d = new TimelineMax({
            paused: true
        });
        tlContainer3d.to(svgContainer, 0.3, {
            x: "-=6px",
            y: "+=6px"
        });
        el.animationContainer3d = tlContainer3d;
        tlContainer3d.progress(1).progress(0);

        // Container 3d push effect left
        var tlContainer3dLeft = new TimelineMax({
            paused: true
        });
        tlContainer3dLeft.to(svgContainerLeft, 0.3, {
            width: "4px"
        });
        el.animationContainer3dLeft = tlContainer3dLeft;
        tlContainer3dLeft.progress(1).progress(0);

        // Container 3d push effect bottom
        var tlContainer3dBottom = new TimelineMax({
            paused: true
        });
        tlContainer3dBottom.to(svgContainerBottom, 0.3, {
            height: "4px",
            right: "+=6px"
        });
        el.animationContainer3dBottom = tlContainer3dBottom;
        tlContainer3dBottom.progress(1).progress(0);

        // .reveal
        // Img move animation
        var tlImgMove = new TimelineMax({
            paused: true
        });
        tlImgMove.to(img, 0.3, {
            scale: 1,
            ease: Sine.easeOut,
            '-webkit-filter': 'grayscale(0%)',
             filter: 'grayscale(0%)'
        }, 0.05);
        el.animationImgMove = tlImgMove;
        tlImgMove.progress(1).progress(0);

        // Mask click text animation
        var tlText = new TimelineMax({
            paused: true
        })
        tlText.to(elSplit, .35, {
            autoAlpha: 0
        });
        el.animationTextClick = tlText;
        tlText.progress(1).progress(0);

        // .skills
        // Set initial state
        TweenLite.set('.logo', {
            transformOrigin: "50% 50%",
        });
        // Animate SVG path (logo)
        var tlLogo = new TimelineMax({
            paused: true
        })
        tlLogo.to(logo, .6, {
            autoAlpha: 1,
            fill: "#ffffff",
            rotation: 360,
            scale: 1,
            autoAlpha: .7,
            ease: Circ.easeInOut,
            morphSVG: {
                shape: ".logo-to",
                shapeIndex: -1
            }
        });

        // .skills
        // Animate SVG (viewbox)
        tlLogo.to(svg, .6, {
            ease: Circ.easeInOut,
            attr: {
                width: 200,
                height: 200
            },
            transformOrigin: "50% 50%",
            css: {
                marginLeft: -125,
                marginTop: -125
            },
        }, 0)
        tlLogo.progress(1).progress(0);
        el.animationLogo = tlLogo;

        // Animate Text
        var tlText = new TimelineMax({
            paused: true
        })
        tlText.to(text, .3, {
            fontSize: '24px',
            rotation: 0,
            x: -55,
            y: -100,
            autoAlpha: .7,
        }, .3);
        tlText.progress(1).progress(0);
        el.animationText = tlText;

        // Animate list out
        /* var tlListOut = new TimelineMax({
            paused: true
        })
        tlListOut.to(list, .1, {
            autoAlpha: 0,
            x: -10,
            ease: Sine.easeInOut,
            overwrite: "all"
        });
        tlListOut.progress(1).progress(0);
        el.animationListOut = tlListOut; */

        // Animate list in
        var tlListIn = new TimelineMax({
            paused: true
        })
        tlListIn.staggerTo(list, .3, {
            x: 0,
            delay: .45,
            autoAlpha: 1,
            ease: Sine.easeInOut
        }, 0.3);
        tlListIn.progress(1).progress(0);
        el.animationListIn = tlListIn;

        // Assign event listeners
        // Generic and applied to all instances of ".box"
        el.addEventListener("mousedown", boxMouseDown);
        el.addEventListener("mouseleave", boxMouseLeave);
        // Only applied to ".reveal-box"
        el.addEventListener("mousemove", revealMouseMove);
        el.addEventListener("mousedown", revealMouseDown);
        el.addEventListener("mouseleave", revealMouseLeave);
        // Only applied to ".skills-box"
        el.addEventListener("mousedown", skillsMouseDown);
        el.addEventListener("mouseleave", skillsMouseLeave);

    });

    var revealElOver = true,
        revealClicked = false,
        skillsClicked = false;
    // Event listener functions
    function revealMouseMove(e) {
        if (revealElOver) { // Only run if mousedown hasn't been triggered

            // Get coordinates of container
            var rect = this.getBoundingClientRect();
            var xPos = e.pageX - rect.left;
            var yPos = e.pageY - rect.top - window.scrollY;

            // Add coordinates to array and pass in to moveMask function
            moveMask(this, xPos, yPos);

            this.animationMaskMove.play();
        }
    }

    // .box
    function boxMouseDown(e) {
        this.animationContainer3d.play();
        this.animationContainer3dLeft.play();
        this.animationContainer3dBottom.play();

    };

    function boxMouseLeave(e) {
        this.animationContainer3d.reverse();
        this.animationContainer3dLeft.reverse();
        this.animationContainer3dBottom.reverse();

    };

    // .reveal-box
    function revealMouseDown(e) {
        this.animationMaskClick.play();
        this.animationTextClick.play();
        revealClicked = true;
        revealElOver = false;
    };

    function revealMouseLeave(e) {
        this.animationTextClick.timeScale(1.25).reverse();
        // If revealClicked then run slow animation
        if (revealClicked) {
            this.animationMaskSlowLeave.play();
        } else {
            this.animationMaskLeave.play();
        }
        revealClicked = false;
        revealElOver = true;
    };

    // .skills-box
    function skillsMouseDown(e) {
        this.animationLogo.play();
        this.animationText.play();
        this.animationListIn.play(0);
        skillsClicked = true;
    };

    function skillsMouseLeave(e) {
        if (skillsClicked) {
            this.animationLogo.reverse(0);
            this.animationText.reverse(1);
            this.animationListIn.progress(0).pause();
        }
        skillsClicked = false;
    };


}());

// Do stuff instantly
(function() {
    // this anonymous function is sloppy...
}());
