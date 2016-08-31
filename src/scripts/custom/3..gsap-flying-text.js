// Custom script containing Tweens using the Greensock Animation Platform
(function() {
    'use strict';

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
}());
