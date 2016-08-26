(function() {
    'use strict';

    // Store Variables
    var box = document.querySelectorAll(".box");
        //depth = '5px'; // Must be half of CSS '$depth' variable

    // Flying Text Effect
    var split = document.querySelectorAll('.words h2, .words h3, .words p, .words li');
    var tlSplitText = new TimelineLite({
            onCompleteAll: function() {
                mySplitText.revert();
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

    // Tweens that require access to coordinates
    function moveMask(el, valueX, valueY) {
        var img = el.querySelectorAll('.img');

        // Mask move animation
        var tlMove = new TimelineLite({
            paused: true
        });
        tlMove.set(img, {
            webkitClipPath: '40px at ' + valueX + 'px ' + valueY + 'px'
        });
        el.animationMaskMove = tlMove;

        // Mask click animation
        var tlClick = tlLeave = new TimelineLite({
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
        var tlLeave = new TimelineLite({
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
        var tlLeaveSlow = new TimelineLite({
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

    // Force initial run with dummy coordinates (so tweens can be cached)
    [].forEach.call(box, function(el) {
        moveMask(el, -100, -100)
    });

    // Tweens that don't require access to coordinates
    [].forEach.call(box, function(el) {
        // Box
        var svgContainer = el.querySelectorAll('.svg-container');
        var svgContainerLeft = el.querySelectorAll('.box .left');
        var svgContainerBottom = el.querySelectorAll('.box .bottom');
        // Reveals Box
        var img = el.querySelectorAll('.reveal-box .img');
        var mask = el.querySelectorAll('.reveal-box .mask');
        var text = el.querySelectorAll('.reveal-box .text');
        var elSplit = el.querySelectorAll('.reveal-box .words');
        // Skills Box
        var logo = el.querySelectorAll('.skills-box .logo');
        var svg = el.querySelectorAll('.skills-box svg');
        var text = el.querySelectorAll('.skills-box h2');
        var list = el.querySelectorAll('.skills-box ul li');

        // Box - 3D depth animation
        var tlContainer3d = new TimelineLite({
            paused: true
        });
        tlContainer3d.to(svgContainer, 0.3, {
            x: "-=5px",
            y: "+=5px"
        });
        el.animationContainer3d = tlContainer3d;
        tlContainer3d.progress(1).progress(0);

        // Box - 3D depth animation Left
        var tlContainer3dLeft = new TimelineLite({
            paused: true
        });
        tlContainer3dLeft.to(svgContainerLeft, 0.3, {
            width: "5px"
        });
        el.animationContainer3dLeft = tlContainer3dLeft;
        tlContainer3dLeft.progress(1).progress(0);

        // Box - 3D depth animation Bottom
        var tlContainer3dBottom = new TimelineLite({
            paused: true
        });
        tlContainer3dBottom.to(svgContainerBottom, 0.3, {
            height: "5px",
            right: "+=5px"
        });
        el.animationContainer3dBottom = tlContainer3dBottom;
        tlContainer3dBottom.progress(1).progress(0);

        // Reveal Box - Image animation
        var tlImgMove = new TimelineLite({
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

        // Reveal Box - Mask click text animation
        var tlText = new TimelineLite({
            paused: true
        })
        tlText.to(elSplit, 0.35, {
            autoAlpha: 0
        });
        el.animationTextClick = tlText;
        tlText.progress(1).progress(0);

        // Skills Box - Set initial state
        TweenLite.set(logo, {
            transformOrigin: "50% 50%",
        });
        // Skills Box - Animate SVG path (logo)
        var tlLogo = new TimelineLite({
            paused: true
        })
        tlLogo.to(logo, 0.6, {
            fill: "#ffffff",
            rotation: 360,
            scale: 1,
            autoAlpha: 0.7,
            ease: Circ.easeInOut,
            morphSVG: {
                shape: ".logo-to",
                shapeIndex: -1
            }
        });

        // Skills Box -  Animate SVG (viewbox)
        tlLogo.to(svg, 0.6, {
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

        // Skills Box - Animate Text
        var tlText = new TimelineLite({
            paused: true
        });
        tlText.to(text, 0.3, {
            fontSize: '24px',
            rotation: 0,
            x: -55,
            y: -100,
            autoAlpha: 0.7,
        }, 0.3);
        tlText.progress(1).progress(0);
        el.animationText = tlText;

        // Skills Box - Animate list out
        /* var tlListOut = new TimelineLite({
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
        var tlListIn = new TimelineLite({
            paused: true
        });
        tlListIn.staggerTo(list, 0.3, {
            x: 0,
            delay: 0.45,
            autoAlpha: 1,
            ease: Sine.easeInOut
        }, 0.3);
        tlListIn.progress(1).progress(0);
        el.animationListIn = tlListIn;

        // Assign event listeners
        el.addEventListener("mousedown", boxMouseDown);
        el.addEventListener("mouseleave", boxMouseLeave);
        el.addEventListener("mousemove", revealMouseMove);
        el.addEventListener("mousedown", revealMouseDown);
        el.addEventListener("mouseleave", revealMouseLeave);
        el.addEventListener("mousedown", skillsMouseDown);
        el.addEventListener("mouseleave", skillsMouseLeave);

    });

    // Variables that will be used to check state of user interaction
    var revealElOver = true,
        revealClicked = false,
        skillsClicked = false;

    // Event listener functions
    function revealMouseMove(e) {
        if (revealElOver) {

            // Get coordinates of box
            var rect = this.getBoundingClientRect(),
            xPos = e.pageX - rect.left,
            yPos = e.pageY - rect.top - window.scrollY;

            // Add coordinates to array and pass in to moveMask function
            moveMask(this, xPos, yPos);

            this.animationMaskMove.play();
        }
    }

    // Box
    function boxMouseDown() {
        this.animationContainer3d.play();
        this.animationContainer3dLeft.play();
        this.animationContainer3dBottom.play();

    };

    function boxMouseLeave() {
        this.animationContainer3d.reverse();
        this.animationContainer3dLeft.reverse();
        this.animationContainer3dBottom.reverse();

    };

    // Box - Reveal
    function revealMouseDown() {
        this.animationMaskClick.play();
        this.animationTextClick.play();
        revealClicked = true;
        revealElOver = false;
    };

    function revealMouseLeave() {
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

    // Box - Skills
    function skillsMouseDown() {
        this.animationLogo.play();
        this.animationText.play();
        this.animationListIn.play(0);
        skillsClicked = true;
    };

    function skillsMouseLeave() {
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
