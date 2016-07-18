function grid(parent) {
    return function(p) {
        var loaded = false;
        var playing = false;
        var kickPattern = [0, 0, 0, 0, 0];
        var prevTime;
        var tpm = 320;
        var mspt = (60 * 1000) / tpm;
        var tickIndex = 0;
        var timeTillNextTick = mspt;
        
        /*****************
         ***** Setup *****
         *****************/
        
        p.setup = function() {
            kick = p.loadSound(["../resources/sounds/kick.ogg", "../resources/sounds/kick.mp3"], p.onLoad);
            addCheckbox(-1, true);
            for (var i=0; i<6; i++) {
                addCheckbox(i, false);
            }
            prevTime = p.millis();
        }
        
        function addCheckbox(i, isPlayToggle) {
            //div
            var div = p.createDiv('');
            div.parent(parent);
            if (isPlayToggle) {
                div.class('playToggle');
                div.id('play-toggle');
                div.touchStarted(togglePlayback);
            }
            else {
                div.class('toggle');
                div.id(i);
                div.touchStarted(toggleNote);
            }

            //input
            var input = p.createInput();
            input.parent(div);
            input.attribute('type', 'checkbox');
            input.parent(div);
            if (isPlayToggle) {
                input.id('play-input');
                document.getElementById('play-input').checked = false;
                
            }
            else {
                input.id('input ' + i);
                document.getElementById('input ' + i).checked = true;
            }          

            //label
            var label = p.createElement('label');
            label.parent(div);
            if (isPlayToggle) {
                label.attribute('for', 'play-input');
                label.id('play-label');
            }
            else {
                label.attribute('for', 'input ' + i);
                label.id('label ' + i);
            }

            return input;
        }
        
        p.onLoad = function() {
            loaded = true;
            var phrase = new Phrase('kick', playKick, kickPattern);
            var Part = new Part();
            part.addPhrase(kickPhrase);
            part.setBPM(80);
            console.log(part);
        }
        
        /********************
         ***** Playback *****
         ********************/
        
        function togglePlayback() {
            var input = select('#play-input');
            if (!input.checked()) {
                p.beginPlayback();
            }
            else {
                p.stopPlayback();
            }
        }
        
        p.beginPlayback = function() {
            playing = true;
        }
        
        p.stopPlayback = function() {
            playing = false;
        }
        
        function playKick(time, val) {
            if (val == 1) {
                kick.play();
            }
        }
        
        function toggleNote(div) {
            
        }
        
        p.draw = function() {
            var dt = p.millis() - prevTime;
            prevTime = p.millis();
            if (loaded && playing) {
                timeTillNextTick -= dt;
                if (timeTillNextTick <= 0) {
                    beatIndex = (beatIndex+1) % kickPattern.length;
                    timeTillNextTick += mspt;
                }
            }
        }
    };
}