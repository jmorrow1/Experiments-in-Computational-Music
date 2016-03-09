function rhythm_visualization(parent, canvas_width, canvas_height, neutralColor, brightColor, lineThickness, dotSize, bkgdColor) {
    return function(p) {
        var line_a = new Line(0.125, 0.5, 0.875, 0.5, p);
        var line_c = new Line(0.125, 0.5, 0.125, 0.5, p);
        var beat_x;
        var sound;
        var rhythm;
        var prev_t, dt;
        var bpm = 120;
        var bpms = bpm / (60 * 1000);
        var beatpt = -1;
        var repeatpt = 4;
        var canvas;
        var b1;
        var loaded = false;
        var play = false;
        
        p.stopPlayback = function() {
            play = false;
        }

        p.setup = function() {
            var path = "../resources/sounds/";
            sound = p.loadSound([path+"kick.ogg", path+"kick.mp3"], function() {loaded=true;});

            canvas = p.createCanvas(canvas_width, canvas_height);
            canvas.parent(parent);
            
            line_a.scale(p.width, p.height, p);
            line_c.scale(p.width, p.height, p);

            prev_t = p.millis();

            rhythm = generateRhythmForProg2(0.25, repeatpt, 0.5, sound);  
            
            neutralColor = p.color(neutralColor);
            brightColor = p.color(brightColor);
        }

        p.draw = function() {
            //update program time
            dt = p.millis() - prev_t;
            prev_t = p.millis();

            if (loaded) {
                if (play) {
                    //update musical time
                    beatpt += dt * bpms;
                    if (beatpt >= repeatpt) {
                        beatpt -= repeatpt;
                    }
                }

                rhythm.play(beatpt);

                //draw things
                p.background(bkgdColor);  
                beat_x = p.map(beatpt, 0, repeatpt, line_a.x1, line_a.x2);
                
                //draw lines
                p.strokeWeight(lineThickness);
                
                p.stroke(neutralColor);
                line_a.display();
                
                p.stroke(brightColor);
                line_c.x2 = beat_x;
                line_c.display();

                //draw notes
                var beatAmt = p.map(beatpt, 0, rhythm.duration, 0, 1);
                embedRhythm(rhythm, line_a, dotSize, neutralColor, brightColor, beatAmt, p);
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

        function generateRhythmForProg2(subdivision, duration, noteChance, sound) {
            beatpt = -1;
            return generateRandomRhythm(subdivision, duration, noteChance, sound);
        }
    };
}