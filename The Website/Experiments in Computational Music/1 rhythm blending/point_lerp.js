var ex1 = function (canvas_x1, canvas_y1, canvas_width, canvas_height, neutralColor, brightColor, lineThickness, dotSize, bkgdColor) {
    return function (p) {
        var a, b;
        var lerpAmt = 0;
        var end_pt_diam = 10;
        
        p.setup = function() {
            var canvas = p.createCanvas(canvas_width, canvas_height);
            canvas.position(canvas_x1, canvas_y1);
            a = {x:50, y:50};
            b = {x:350, y:100};
            neutralColor = p.color(neutralColor);
            brightColor = p.color(brightColor);
            p.noLoop();
        }

        p.draw = function() {
            p.background(bkgdColor);

            p.strokeWeight(lineThickness);
            
            //draw points a & b
            p.noFill();
            p.stroke(neutralColor);
            p.ellipse(a.x, a.y, dotSize, dotSize);
            p.ellipse(b.x, b.y, dotSize, dotSize);
            //draw labels for points a & b
            p.noStroke();
            p.fill(neutralColor);
            p.textSize(16);
            p.textAlign(p.CENTER, p.TOP);
            p.text("pt a", a.x, a.y + 16);
            p.text("pt b", b.x, b.y + 16);
            //draw lerped point
            var c = lerp2d(a, b, lerpAmt, p);
            p.noStroke();
            p.fill(brightColor);
            p.ellipse(c.x, c.y, dotSize, dotSize);      
            lerpAmt += 0.004;
            if (lerpAmt >= 1) lerpAmt = 0;
        }
        
        p.mouseMoved = function() {
            lerpAmt = p.map(p.winMouseX, 0, p.windowWidth-1, 0, 1);
            if (lerpAmt < 0) lerpAmt = 0;
            if (lerpAmt > 1) lerpAmt = 1;
            p.redraw();
        }
        
    };
}