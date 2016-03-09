var rhythm_blending_2 = function(parent, canvas_width, canvas_height, neutralColor, brightColor, lineThickness, dotSize, bkgdColor, userControlled, blendingMode, rhythmPresetNum) {   
    return function(p) {
        var radius = p.min(0.45*canvas_width, 0.45*canvas_height);
        
        var shape1 = new Line(0.125*canvas_width, 0.33*canvas_height, 0.875*canvas_width, 0.33*canvas_height, p);
        var shape2 = new Line(shape1.x1, 0.66*canvas_height, shape1.x2, 0.66*canvas_height, p);

        var prev_beatpt = -1;
        var beatpt = -1;
        var bpm = 120;
        var bpms = bpm / (60 * 1000);

        var rhythmA, rhythmB, rhythmAB, rhythmBA;

        var prev_t;

        var blendDirection = 1;
        var blendAmt = 0;
        var blendSpeed;
        if (blendingMode == "discrete") {
            blendSpeed = 1.0/16.0;
        }
        else {
            blendSpeed = 0.001;
        }
        
        var play = false;
        var loaded = false;
        
        var guiControl;
        
        p.stopPlayback = function() {
            play = false;
        }

        p.setup = function() {
            var path = "../resources/sounds/";
            
            var sound1 = p.loadSound([path+"kick.ogg", path+"kick.mp3"], function() {loaded = true;});
            sound1.pan(-0.5);
            var sound2 = p.loadSound([path+"tom1.ogg", path+"tom1.mp3"], function() {loaded = true;});
            sound2.pan(0.5);
            
            var canvas = p.createCanvas(canvas_width, canvas_height);
            canvas.parent(parent);
            
            var rhythms = getRhythmPair(rhythmPresetNum, sound1, sound2)
            rhythmA = rhythms[0];
            rhythmB = rhythms[1];
            rhythmAB = rhythmA.clone();
            rhythmBA = rhythmB.clone();
            
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
                    prev_beatpt = beatpt;
                    beatpt += dt * bpms;
                    if (beatpt >= rhythmA.duration) {
                        beatpt -= rhythmA.duration;
                    }
                    else if (beatpt >= rhythmB.duration) {
                        beatpt -= rhythmB.duration;
                    }
                }

                var numNotes = (rhythmA.numNotes() == rhythmB.numNotes()) ? rhythmA.numNotes() : 0;  
                if (numNotes == 0) console.log("error: numNotes == 0");

                //blend rhythm ab
                for (var i=0; i<numNotes; i++) {
                    rhythmAB.notes[i] = p.lerp(rhythmA.notes[i], rhythmB.notes[i], blendAmt);
                    rhythmBA.notes[i] = p.lerp(rhythmB.notes[i], rhythmA.notes[i], blendAmt);
                }
                //change blend amt
                if (!userControlled) {
                    if (blendingMode == "discrete") {
                        if (prev_beatpt > beatpt) {
                            blendAmt += blendSpeed*blendDirection;
                        }
                    }
                    else if (blendingMode == "continuous") {
                        blendAmt += blendSpeed*blendDirection;
                    }
                    if (blendAmt <= 0 && blendDirection == -1) {
                        blendDirection = 1;
                    }
                    else if (blendAmt >= 1 && blendDirection == 1) {
                        blendDirection = -1;
                    }
                }   

                //play rhythms
                rhythmAB.play(beatpt);
                rhythmBA.play(beatpt);

                //draw things
                p.background(bkgdColor);

                //draw regular shapes
                p.strokeWeight(lineThickness);
                p.stroke(neutralColor);
                p.noFill();
                shape1.display();
                shape2.display();

                //draw highlighted shapes
                p.stroke(brightColor);
                p.noFill();
                var amt = p.map(beatpt, 0, rhythmA.duration, 0, 1);
                var pts1 = shape1.getAllVerticesInRange(0, amt);
                pts1.push(shape1.trace(amt));
                drawShape(pts1);
                var pts2 = shape2.getAllVerticesInRange(0, amt);
                pts2.push(shape2.trace(amt));
                drawShape(pts2);

                //draw notes
                var beatAmt = p.map(beatpt, 0, rhythmAB.duration, 0, 1);
                embedRhythm(rhythmAB, shape1, dotSize, neutralColor, brightColor, beatAmt, p);
                embedRhythm(rhythmBA, shape2, dotSize, neutralColor, brightColor, beatAmt, p);
            }
        }
        
        p.mouseMoved = function() {
            //change blend amt
            if (userControlled) {
                blendAmt = p.map(p.winMouseX, 0, p.windowWidth, 0, 1);
                if (blendAmt < 0) blendAmt = 0;
                if (blendAmt > 1) blendAmt = 1;
                
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
        
        function drawShape(pts) {
            p.beginShape();
            for (var i=0; i<pts.length; i++) {
                p.vertex(pts[i].x, pts[i].y);
            }
            p.endShape();
        }
    };
}