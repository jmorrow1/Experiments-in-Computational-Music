function waveform(parent, loop, name, waveWidth, canvasWidth) {
    return function(p5) {
        //loop data
        var peaks;
        
        //style
        var r = 194, g = 127, b = 26;
        
        //playback
        var playing = false;
        var prev_x = 1000;
        
        /*****************
         ***** Setup *****
         *****************/
            
        p5.setup = function() {
            var canvas = p5.createCanvas(canvasWidth, 100);
            canvas.parent(parent);
            peaks = loop.getPeaks(waveWidth);
            drawBackground();
        }
        
        /****************
         ***** Draw *****
         ****************/
        
        p5.draw = function() {
            if (playing) {
                var x = p5.int(p5.map(loop.currentTime(), 0, loop.duration(), 0, waveWidth));
                if (x < prev_x) {
                    drawBackground();
                }
                prev_x = x;
                var radius = (0 <= x && x < peaks.length) ? peaks[x] * p5.height/2 : 0;
                p5.stroke(r, g, b, 255);
                p5.line(x, p5.height/2 - radius, x, radius + p5.height/2);
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
            
            p5.textSize(12);
            p5.strokeWeight(1);
            p5.stroke(r, g, b);
            p5.fill(r, g, b);
            p5.text(name, 0, p5.height - 5);
        }
        
        /********************
         ***** Playback *****
         ********************/
        
        p5.startPlayingLoop = function() {
            loop.loop();
            playing = true;
        }
        
        p5.stopPlayingLoop = function() {
            loop.stop();
            playing = false;
        }
        
        p5.mousePressed = function() {
            if (0 <= p5.mouseX && p5.mouseX <= waveWidth && 0 <= p5.mouseY && p5.mouseY <= p5.height) {
                if (!playing) {
                    stopAllPlayback();
                    p5.startPlayingLoop();
                }
                else {
                    p5.stopPlayingLoop();
                }
            }
        }
    }
}