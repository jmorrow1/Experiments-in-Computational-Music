function audioplayer(parent, loopName) {
    return function(p5) {
        var loop;
        var peaks;
        var r = 194, g = 127, b = 26;
        var prev_x = 1000;
        var playing = false;
        
        p5.preload = function() {
            loop = p5.loadSound(["loops/" + loopName + ".mp3", "loops/" + loopName + ".ogg"]);      
        }
        
        p5.setup = function() {
            var w = p5.int(20 * loop.duration());
            var canvas = p5.createCanvas(w, 100);
            canvas.parent(parent);
            peaks = loop.getPeaks(w);
            drawBackground();
        }
        
        p5.draw = function() {
            if (playing) {
                var x = p5.int(p5.map(loop.currentTime(), 0, loop.duration(), 0, p5.width));
                if (x < prev_x) {
                    drawBackground();
                }
                prev_x = x;
                var radius = (0 <= x && x < peaks.length) ? peaks[x] * p5.height/2 : 0;
                p5.stroke(r, g, b, 255);
                p5.line(x, p5.height/2 - radius, x, radius + p5.height/2);
            }
        }
        
        p5.startPlayingLoop = function() {
            loop.loop();``
        }
        
        p5.stopPlayingLoop = function() {
            loop.stop();
        }
        
        //temporary:
        p5.mousePressed = function() {
            if (0 <= p5.mouseX && p5.mouseX <= p5.width && 0 <= p5.mouseY && p5.mouseY <= p5.height) {
                playing = !playing; 
                if (playing) {
                    loop.loop();
                }
                else {
                    loop.stop();
                }
            }
        }
        
        function drawBackground() {
            p5.background(255);
            var startX = 0;
            p5.strokeWeight(2);
            p5.stroke(r, g, b, 200);
            for (var i=0; i<peaks.length; i+=4) {
                var radius = peaks[i] * p5.height/2;
                p5.line(startX + i, p5.height/2 - radius, startX + i, p5.height/2 + radius);
            }
        }
    }
}