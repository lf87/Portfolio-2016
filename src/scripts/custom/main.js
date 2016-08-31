// Custom script containing Tweens using the Greensock Animation Platform
(function() {
    'use strict';

    // Get document width
    var winX = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        winMd = 767;

    // Detect touch device
    var isTouchDevice = 'ontouchstart' in document.documentElement;

    // Skill Switch
    var switchWrap = document.getElementById('skill-switch'),
        skillEl = document.querySelectorAll('#skills li'),
        switchDelay = 1.5,
        switchArray = [];

    // Push each iteration to array
    [].forEach.call(skillEl, function(el) {
        var skill = switchArray.push(el.innerHTML);
    });

    // Create timeline and do tweens
    var tlSwitch = new TimelineMax({
        onComplete: function() {
            this.restart();
        }
    });

    tlSwitch.to(switchWrap, .75, { text: switchArray[0], delay: switchDelay, ease: Linear.easeNone })
        .to(switchWrap, .5, { text: switchArray[1], delay: switchDelay, ease: Linear.easeNone })
        .to(switchWrap, 1, { text: switchArray[2], delay: switchDelay, ease: Linear.easeNone })
        .to(switchWrap, 1.5, { text: switchArray[3], delay: switchDelay, ease: Linear.easeNone })
        .to(switchWrap, 1, { text: switchArray[4], delay: switchDelay, ease: Linear.easeNone })
        .to(switchWrap, 1, { text: switchArray[5], delay: switchDelay, ease: Linear.easeNone })

    // Flying Text Effect
    var split = document.querySelectorAll('.words h2, .words h3, .words p, .words li'),
        tlSplitText = new TimelineLite({
            onCompleteAll: function() {
                mySplitText.revert();
            }
        }),
        mySplitText = new SplitText(split, {
            type: 'chars'
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
        transformOrigin: '0% 50% -50',
        ease: Back.easeOut
    }, 0.01, '+=0');
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
        var tlClick = new TimelineLite({
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

    var box = document.querySelectorAll('.box');
    // Tweens that don't require access to coordinates
    [].forEach.call(box, function(el) {
        // Force initial run with dummy coordinates (So tweens can be cached)
        moveMask(el, -100, -100);
        var boxContent = el.querySelectorAll('.box-content');
        var box3dLeft = el.querySelectorAll('.box .left');
        var box3dRight = el.querySelectorAll('.box .bottom');
        var img = el.querySelectorAll('.reveal-box .img');
        var elSplit = el.querySelectorAll('.reveal-box .words');
        var logo = el.querySelectorAll('.skills-box .logo');
        var svg = el.querySelectorAll('.skills-box svg');
        var h2 = el.querySelectorAll('.skills-box h2');
        var list = el.querySelectorAll('.skills-box ul li');

        // Box - 3D depth animation
        var depth = '6'; // Must match what it's set to in the CSS
        var depthHalf = '3';
        var depthSpeed = 0.3;

        var tlBox3d = new TimelineLite({
            paused: true
        });
        tlBox3d.to(boxContent, depthSpeed, {
            x: '-=' + depthHalf + 'px',
            y: '+=' + depthHalf + 'px'
        });
        el.animationBox3d = tlBox3d;
        tlBox3d.progress(1).progress(0);

        // Box - 3D depth animation Left
        var tlBox3dLeft = new TimelineLite({
            paused: true
        });
        tlBox3dLeft.to(box3dLeft, depthSpeed, {
            width: depthHalf + 'px'
        });
        el.animationBox3dLeft = tlBox3dLeft;
        tlBox3dLeft.progress(1).progress(0);

        // Box - 3D depth animation Bottom
        var tlBox3dBottom = new TimelineLite({
            paused: true
        });
        tlBox3dBottom.to(box3dRight, depthSpeed, {
            height: depthHalf + 'px',
            right: '+=' + depthHalf + 'px'
        });
        el.animationBox3dBottom = tlBox3dBottom;
        tlBox3dBottom.progress(1).progress(0);

        // Reveal Box - Image animation
        var tlRevealImgMove = new TimelineLite({
            paused: true
        });
        tlRevealImgMove.to(img, 0.3, {
            scale: 1,
            ease: Sine.easeOut,
            '-webkit-filter': 'grayscale(0%)',
            filter: 'grayscale(0%)'
        }, 0.05);
        el.animationImgMove = tlRevealImgMove;
        tlRevealImgMove.progress(1).progress(0);

        // Reveal Box - Mask click text animation
        var tlRevealText = new TimelineLite({
            paused: true
        });
        tlRevealText.to(elSplit, 0.35, {
            autoAlpha: 0
        });
        el.animationTextClick = tlRevealText;
        tlRevealText.progress(1).progress(0);

        // Skills Box - Set initial state
        TweenLite.set(logo, {
            transformOrigin: '50% 50%',
        });

        // Skills Box - Animate SVG path (logo)
        var tlSkillsLogo = new TimelineLite({
            paused: true
        });
        tlSkillsLogo.to(logo, 0.6, {
            rotation: 360,
            morphSVG: {
                shape: '.logo-to',
                shapeIndex: -1
            },
            ease: Circ.easeInOut
        });

        // Skills Box -  Animate SVG (viewbox)
        tlSkillsLogo.to(svg, 0.6, {
            ease: Circ.easeInOut,
            attr: {
                width: 200,
                height: 200
            },
            transformOrigin: '50% 50%',
            css: {
                marginLeft: -125,
                marginTop: -125
            },
        }, 0);
        tlSkillsLogo.progress(1).progress(0);
        el.animationLogo = tlSkillsLogo;

        // Skills Box - Animate Text
        var tlSkillsText = new TimelineLite({
            paused: true
        });
        tlSkillsText.to(h2, 0.3, {
            fontSize: '24px',
            color: '#FF5722',
            rotation: 0,
            x: -55,
            y: -100,
            autoAlpha: 0.9,
        }, 0.3);
        tlSkillsText.progress(1).progress(0);
        el.animationText = tlSkillsText;

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
        el.addEventListener('mousedown', boxMouseDown);
        el.addEventListener('mouseleave', boxMouseLeave);
        el.addEventListener('mousemove', revealMouseMove);
        el.addEventListener('mousedown', revealMouseDown);
        el.addEventListener('mouseleave', revealMouseLeave);
        el.addEventListener('mousedown', skillsMouseDown);
        el.addEventListener('mouseleave', skillsMouseLeave);

    });

    // Variables that will be used to check state of user interaction
    var revealElOver = true,
        revealClicked = false,
        skillsClicked = false;

    // Event listener functions
    function revealMouseMove(e) {
        /*jshint validthis: true */
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
        /*jshint validthis: true */
        this.animationBox3d.play();
        this.animationBox3dLeft.play();
        this.animationBox3dBottom.play();
    }

    function boxMouseLeave() {
        /*jshint validthis: true */
        if (isTouchDevice) {
            this.animationBox3d.progress(0).pause();
            this.animationBox3dLeft.progress(0).pause();
            this.animationBox3dBottom.progress(0).pause();
        } else {
            this.animationBox3d.reverse();
            this.animationBox3dLeft.reverse();
            this.animationBox3dBottom.reverse();
        }

    }

    // Box - Reveal
    function revealMouseDown() {
        /*jshint validthis: true */
        this.animationMaskClick.play();
        this.animationTextClick.play();
        revealClicked = true;
        revealElOver = false;
    }

    function revealMouseLeave() {
        /*jshint validthis: true */
        this.animationTextClick.timeScale(1.25).reverse();
        // If revealClicked then run slow animation
        if (revealClicked) {
            this.animationMaskSlowLeave.play();
        } else {
            this.animationMaskLeave.play();
        }
        revealClicked = false;
        revealElOver = true;
    }

    // Box - Skills
    function skillsMouseDown() {
        /*jshint validthis: true */
        if (isTouchDevice) {
            this.animationLogo.progress(1);
            this.animationText.progress(1);
        } else {
            this.animationLogo.play();
            this.animationText.play();
        }
        this.animationListIn.play(0);
        skillsClicked = true;
    }

    function skillsMouseLeave() {
        /*jshint validthis: true */
        if (skillsClicked) {
            if (isTouchDevice) {
                this.animationLogo.progress(0).pause();
                this.animationText.progress(0).pause();
                this.animationListIn.progress(0).pause();
            } else {
                this.animationLogo.reverse(0);
                this.animationText.reverse(1);
                this.animationListIn.progress(0).pause();
            }
        }
        skillsClicked = false;
    }
}());
