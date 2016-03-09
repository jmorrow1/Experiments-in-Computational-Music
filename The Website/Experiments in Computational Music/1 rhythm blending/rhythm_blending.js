var rhythm_blending = function(parent, canvas_width, canvas_height, neutralColor, brightColor, lineThickness, dotSize, bkgdColor, userControlled, rhythmPreset) {    
    return function(p) {
        var c = new Line(0.125*canvas_width, 0.5*canvas_height, 0.875*canvas_width, 0.5*canvas_height, p);
        var c_hl = new Line(c.x1, c.y1, c.x1, c.y1, p);

        var beatpt = -1;
        var bpm = 120;
        var bpms = bpm / (60 * 1000);

        var rhythmA, rhythmB, rhythmC; 
        var numNotes;

        var sound;
        var prev_t;

        var blendAmt = 0;
        var blendSpeed = 0.001;
        
        var loaded = false;
        var play = false;
        
        var guiControl;
        
        p.stopPlayback = function() {
            play = false;
        }

        p.setup = function() {
            var path = "../resources/sounds/";
            sound = p.loadSound([path+"kick.ogg", path+"kick.mp3"], function() {loaded = true;});
            
            var canvas = p.createCanvas(canvas_width, canvas_height);
            canvas.parent(parent);
            
            rhythms = getRhythmPair(rhythmPreset, sound, sound);
            rhythmA = rhythms[0];
            rhythmB = rhythms[1];
            rhythmC = rhythmA.clone();
            numNotes = (rhythmA.numNotes() == rhythmB.numNotes()) ? rhythmA.numNotes() : 0;      

            prev_t = p.millis();
            
            neutralColor = p.color(neutralColor);
            brightColor = p.color(brightColor);
        }

        p.draw = function() {
            //update program time
            var dt = p.millis() - prev_t;
            prev_t = p.millis();

            if (loaded) {
                if (play) {
                    //update musical time
                    beatpt += dt * bpms;
                    if (beatpt >= rhythmC.duration) {
                        beatpt -= rhythmC.duration;
                    }
                }

                
                if (numNotes == 0) console.log("error: numNotes == 0");

                //blend rhythm c
                if (!userControlled) {
                    for (var i=0; i<numNotes; i++) {
                        rhythmC.notes[i] = p.lerp(rhythmA.notes[i], rhythmB.notes[i], blendAmt);
                    }
                    blendAmt += blendSpeed;
                    if (blendAmt <= 0 || blendAmt >= 1) {
                        blendSpeed *= -1;
                    }
                }

                //play rhythm c
                rhythmC.play(beatpt);

                //draw things
                p.background(bkgdColor);
                
                //draw regular lines
                p.strokeWeight(lineThickness);
                p.stroke(neutralColor);
                c.display();

                //draw highlight lines
                p.stroke(brightColor);
                c_hl.x2 = p.map(beatpt, 0, rhythmC.duration, c.x1, c.x2);
                c_hl.display();

                //draw notes
                var beatAmt = p.map(beatpt, 0, rhythmC.duration, 0, 1);
                embedRhythm(rhythmC, c, dotSize, neutralColor, brightColor, beatAmt, p);
            }
        }
        
        p.mouseMoved = function() {
            //change blend amt
            if (userControlled) {
                blendAmt = p.map(p.winMouseX, 0, p.windowWidth, 0, 1);
                if (blendAmt < 0) blendAmt = 0;
                if (blendAmt > 1) blendAmt = 1;
                for (var i=0; i<numNotes; i++) {
                    rhythmC.notes[i] = p.lerp(rhythmA.notes[i], rhythmB.notes[i], blendAmt);
                }
            }
        }
        
        p.mouseClicked = function() {
            if (0 <= p.mouseX && p.mouseX <= p.width && 
                0 <= p.mouseY && p.mouseY <= p.height) {
                if (play == false) {
                    stopPlayback();
                }
                play = !play;
            }
        }
        
        this.stopPlayback = function() {
            play = false;
        }
    };
}