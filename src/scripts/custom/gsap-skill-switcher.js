/*// Custom script containing Tweens using the Greensock Animation Platform
(function() {
    'use strict';

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
}());
*/