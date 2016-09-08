// Custom script containing Tweens using the Greensock Animation Platform
(function() {
    'use strict';

    // The below is taken from underscore.js
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    /*function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };*/

    // Properties object (p.property)
    // DepthTiming       - The speed at which the box will animate
    // Depth             - Half the pixel width of the 3d area surrounding the boxes
    // accentColor       - Literally the accent colour, taken from the variables.scss
    // largeNorTouch     - Returns true if window width is greater than 768px, and no touch device is detected
    // listDelay         - Specify a delay time based upon the window width
    var p = {
        depthTiming: 0.3,
        accentColor: '#FF5722',
        largeNorTouchFunc: function() {
            var winX = window.innerWidth && document.documentElement.clientWidth && document.body.clientWidth,
                winMd = 767,
                isTouchDevice = 'ontouchstart' in document.documentElement,
                a;
            if (winX > winMd && !isTouchDevice) {
                a = true;
            } else {
                a = false;
            }
            return a;
        },
        listDelay: function() {
            var b;
            if (p.largeNorTouchFunc()) {
                b = 0.45;
            } else {
                b = 0;
            }
            return b;
        }
    };
    // Store returned boolean seperately, because we don't
    // want to be checking this every time the function is called
    var largeNorTouch = p.largeNorTouchFunc();
    console.log(p.largeNorTouchFunc());

    // The depth change when the box animates (based
    // on half the computed style of the box edge)
    if (largeNorTouch) {
        var getBox = document.querySelector('.box-content'),
            boxDepthProp = window.getComputedStyle(getBox, null).getPropertyValue('left'),
            boxDepthTrim = boxDepthProp.substring(0, boxDepthProp.length - 2),
            boxDepth = (boxDepthTrim / 2) + 'px';
    }

    // Users browsing at a smaller viewport will be served with an optimised
    // version, replacing some JS animations with CSS animations
    if (!largeNorTouch) {
        document.body.classList.add('from-small-viewport');
    }

    // Background image parallax effect
    if (largeNorTouch) {
        var parallax = document.querySelectorAll('.parallax'),
            speed = 0.5;
        window.onscroll = function() {
            [].slice.call(parallax).forEach(function(el, i) {
                var windowYOffset = window.pageYOffset,
                    elBackgrounPos = 'center -' + (windowYOffset * speed) + 'px';
                // Update style property
                el.style.backgroundPosition = elBackgrounPos;
            });
        };
    }

    // Skill Switch
    var switchWrap = document.getElementById('skill-switch'),
        skillEl = document.querySelectorAll('#skills li'),
        switchDelay = 1.5,
        switchArray = [];

    [].forEach.call(skillEl, function(el) {
        switchArray.push(el.innerHTML); // Each iteration is pushed to an array
    });

    var tlSwitch = new TimelineMax({ onComplete: function() { this.restart(); } });

    tlSwitch.to(switchWrap, 0.75, { text: switchArray[0], delay: switchDelay, ease: Linear.easeNone })
        .to(switchWrap, 0.5, { text: switchArray[1], delay: switchDelay, ease: Linear.easeNone })
        .to(switchWrap, 1, { text: switchArray[2], delay: switchDelay, ease: Linear.easeNone })
        .to(switchWrap, 1.5, { text: switchArray[3], delay: switchDelay, ease: Linear.easeNone })
        .to(switchWrap, 1, { text: switchArray[4], delay: switchDelay, ease: Linear.easeNone })
        .to(switchWrap, 1, { text: switchArray[5], delay: switchDelay, ease: Linear.easeNone });

    // Flying Text Effect
    if (largeNorTouch) {
        var split = document.querySelectorAll('.words h2, .words h3, .words p, .words li'),
            tlSplitText = new TimelineLite({ onCompleteAll: function() { mySplitText.revert(); } }),
            mySplitText = new SplitText(split, { type: 'chars' }),
            chars = mySplitText.chars; // an array of all the divs that wrap each character

        TweenMax.set(split, { perspective: 400 });
        tlSplitText.staggerFrom(chars, 0.4, { opacity: 0, scale: 0, y: 80, rotationX: 180, transformOrigin: '0% 50% -50', ease: Back.easeOut }, 0.01, '+=0');
        tlSplitText.progress(1).progress(0);
    }

    // Tweens that require use of the masks X and Y coordinates
    function moveMask(el, valueX, valueY) {
        // DOM elements to be tweened
        var img = el.querySelectorAll('.img'),
            tlMove = new TimelineLite({ paused: true }),
            tlClick = new TimelineLite({ paused: true }),
            tlLeave = new TimelineLite({ paused: true }),
            tlLeaveSlow = new TimelineLite({ paused: true });

        // Tweens
        // Mask move animation
        tlMove.set(img, { webkitClipPath: '66px at ' + valueX + 'px ' + valueY + 'px' });
        // Mask click animation
        tlClick.to(img, 0.8, { webkitClipPath: '540px at ' + valueX + 'px ' + valueY + 'px', });
        // Mask leave animation
        tlLeave.to(img, 0.2, { webkitClipPath: '0 at ' + valueX + 'px ' + valueY + 'px' });
        // Mask slow leave animation
        tlLeaveSlow.to(img, 0.7, { ease: Bounce.easeOut, webkitClipPath: '0 at ' + valueX + 'px ' + valueY + 'px' });

        // Function calls from event handlers that trigger the animations
        el.animationMaskMove = tlMove;
        el.animationMaskClick = tlClick;
        el.animationMaskLeave = tlLeave;
        el.animationMaskSlowLeave = tlLeaveSlow;

        // Cache tween trick
        tlClick.progress(1).progress(0); // Forces an initial render of this tween so that it's cached for its 2nd usage
        tlLeave.progress(1).progress(0);
        tlLeaveSlow.progress(1).progress(0);
    }

    var box = document.querySelectorAll('.box');
    // Tweens that don't require access to coordinates
    [].forEach.call(box, function(el) {
        // Force initial run with dummy coordinates (So tweens can be cached)
        moveMask(el, -100, -100);

        // DOM elements to be tweened
        var boxContent = el.querySelectorAll('.box-content'),
            box3dLeft = el.querySelectorAll('.box .left'),
            box3dRight = el.querySelectorAll('.box .bottom'),
            img = el.querySelectorAll('.reveal-box .img'),
            revealWords = el.querySelectorAll('.reveal-box .words'),
            logo = el.querySelectorAll('.skills-box .logo'),
            logoTo = el.querySelectorAll('.skills-box .logo-to'),
            svg = el.querySelectorAll('.skills-box svg'),
            h2 = el.querySelectorAll('.skills-box h2'),
            list = el.querySelectorAll('.skills-box ul li');

        // Set up Timelines
        var tlBox3d = new TimelineLite({ paused: true }),
            tlBox3dLeft = new TimelineLite({ paused: true }),
            tlBox3dBottom = new TimelineLite({ paused: true }),
            tlRevealImgMove = new TimelineLite({ paused: true }),
            tlRevealText = new TimelineLite({ paused: true }),
            tlListIn = new TimelineLite({ paused: true }),
            tlSkillsLogo = new TimelineLite({ paused: true }),
            tlSkillsText = new TimelineLite({ paused: true });

        // Tweens
        if (largeNorTouch) {
            // Box (all) - 3D depth
            tlBox3d.to(boxContent, p.depthTiming, { x: '-=' + boxDepth, y: '+=' + boxDepth });
            // Box (all) - 3D depth animation Left
            tlBox3dLeft.to(box3dLeft, p.depthTiming, { width: boxDepth });
            // Box (all) - 3D depth animation Bottom
            tlBox3dBottom.to(box3dRight, p.depthTiming, { height: boxDepth, right: '+=' + boxDepth });
            // Reveal Box - Image animation
            tlRevealImgMove.to(img, 0.3, { scale: 1, ease: Sine.easeOut }, 0.05);
            // Reveal Box - Mask click text animation
            tlRevealText.to(revealWords, 0.35, { autoAlpha: 0 });
        }
        // Skills Box - Set initial state for SVG path (logo)
        TweenLite.set(logo, { transformOrigin: '50% 50%' });
        // Skills Box - Animate SVG path (logo)
        tlSkillsLogo.to(logo, 0.6, { rotation: 360, morphSVG: { shape: logoTo, shapeIndex: -1 }, ease: Circ.easeInOut });
        // Skills Box - Animate SVG (viewbox)
        tlSkillsLogo.to(svg, 0.6, { ease: Circ.easeInOut, attr: { width: 200, height: 200 }, transformOrigin: '50% 50%', css: { marginLeft: -125, marginTop: -165 } }, 0);
        // Skills Box - Animate Text
        tlSkillsText.to(h2, 0.3, { fontSize: '24px', color: p.accentColor, rotation: 0, x: 105, y: -110, autoAlpha: 0.9, }, 0.3);
        // Skills Box - Animate list in
        tlListIn.staggerTo(list, 0.3, { x: 0, delay: p.listDelay(), autoAlpha: 1, ease: Sine.easeInOut }, 0.3);


        // Function calls from event handlers that trigger the animations
        el.animationBox3d = tlBox3d;
        el.animationBox3dLeft = tlBox3dLeft;
        el.animationBox3dBottom = tlBox3dBottom;
        el.animationImgMove = tlRevealImgMove;
        el.animationTextClick = tlRevealText;
        el.animationLogo = tlSkillsLogo;
        el.animationText = tlSkillsText;
        el.animationListIn = tlListIn;

        // Cache tween trick
        tlBox3d.progress(1).progress(0);
        tlBox3dLeft.progress(1).progress(0);
        tlBox3dBottom.progress(1).progress(0);
        tlRevealImgMove.progress(1).progress(0);
        tlRevealText.progress(1).progress(0);
        tlListIn.progress(1).progress(0);
        tlSkillsLogo.progress(1).progress(0);
        tlSkillsText.progress(1).progress(0);

        // Assign event listeners
        if (largeNorTouch) {
            el.addEventListener('mousemove', revealMouseMove);
            el.addEventListener('mousedown', revealMouseDown);
            el.addEventListener('mouseleave', revealMouseLeave);
        }
        el.addEventListener('mousedown', skillsMouseDown);
        el.addEventListener('mouseleave', skillsMouseLeave);

    });

    // Variables that will be used to check state of user interaction
    var revealElOver = true,
        revealClicked = false,
        skillsClicked = false;

    // Reveal box event listener functions - Doesn't get called for large viewport/touch devices
    function revealMouseDown() {
        /*jshint validthis: true */
        this.animationTextClick.play();
        this.animationMaskClick.play();
        this.animationBox3d.play();
        this.animationBox3dLeft.play();
        this.animationBox3dBottom.play();
        revealClicked = true;
        revealElOver = false;
    }

    function revealMouseLeave() {
        /*jshint validthis: true */
        this.animationTextClick.timeScale(1.25).reverse();
        if (revealClicked) {
            this.animationMaskSlowLeave.play();
        } else {
            this.animationMaskLeave.play();
        }
        revealClicked = false;
        revealElOver = true;
    }

    // Skills box event listener functions
    function skillsMouseDown() {
        /*jshint validthis: true */
        if (largeNorTouch) {
            this.animationBox3d.play();
            this.animationBox3dLeft.play();
            this.animationBox3dBottom.play();
            this.animationLogo.play();
            this.animationText.play();
            console.log("in");
        } else {
            this.animationLogo.progress(1);
            this.animationText.progress(1);
        }
        this.animationListIn.play(0);
        skillsClicked = true;
    }

    function skillsMouseLeave() {
        /*jshint validthis: true */
        if (skillsClicked) {
            if (largeNorTouch) {
                this.animationLogo.reverse(0);
                this.animationText.reverse(1);
                this.animationBox3d.reverse();
                this.animationBox3dLeft.reverse();
                this.animationBox3dBottom.reverse();
            } else {
                this.animationLogo.progress(0);
                this.animationText.progress(0);
            }
            this.animationListIn.progress(0).pause();
        }
        skillsClicked = false;
    }

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

    // Reset some of the tween states when window resized to over WinMD value
    /*var tweenResets = debounce(function() {
        [].forEach.call(box, function(el) {
            var reset = myTween.time(0)
        })
    }, 100);

    // Only run resize detection if already below winMd or equal to value
    window.addEventListener('resize', tweenResets);*/

    // Do stuff on window load
    /*window.onload = function() {
        TweenMax.set(parallax,{opacity:0});
        TweenMax.to(parallax, 2.5, {
            opacity: 0.15,
            ease: Back.easeOut
        });
    };*/
}());
