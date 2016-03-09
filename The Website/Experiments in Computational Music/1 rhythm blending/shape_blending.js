var shape_blending = function (parent, canvas_width, canvas_height, neutralColor, brightColor, lineThickness, dotSize, bkgdColor) {
    return function(p) {
        var radius = p.min(canvas_width*0.3, canvas_height*0.3)
        var a = new RegularPolygon(0.5*canvas_width, 0.5*canvas_height, radius, p.int(p.random(3, 5.75)), p);
        var xradius = (p.random(1) < 0.5) ? 1.5*radius : radius;
        var yradius = radius;
        var b = new Ellipse(0.5*canvas_width, 0.5*canvas_height, xradius, yradius, p);
        
        p.setup = function() {
            var canvas = p.createCanvas(canvas_width, canvas_height);
            canvas.parent(parent);

            p.noLoop();
        }
        
        p.draw = function() {
            p.background(bkgdColor);      
            
            var blendAmt = p.map(p.winMouseX, 0, p.windowWidth, 0, 1);
            if (blendAmt < 0) blendAmt = 0;
            if (blendAmt > 1) blendAmt = 1;
            drawBlendedShape(a, b, blendAmt);
        }
        
        p.mouseMoved = function() {
            p.redraw();
        }
        
        function drawDot(pt) {
            p.ellipseMode(p.CENTER);
            p.ellipse(pt.x, pt.y, dotSize, dotSize);
        }
        
        function drawVertex(pt) {
            p.vertex(pt.x, pt.y);
        }
        
        function drawBlendedShape(a, b, blendAmt) {
            //style & draw shape outline
            p.strokeWeight(lineThickness);
            p.noFill();
            p.stroke(neutralColor);
            p.beginShape();
            mapBlendedShape(a, b, blendAmt, 20, drawVertex);
            p.endShape(p.CLOSE);
            
            //draw dots
            p.noStroke();
            p.fill(neutralColor);
            mapBlendedShape(a, b, blendAmt, 20, drawDot);
        }
        
        function mapBlendedShape(a, b, blendAmt, numVertices, vertexFunc) {
            var amt = 0;
            var d_amt = 1.0 / numVertices;
            while (amt < 1.0) {
                vertexFunc(traceBlendedShape(a, b, blendAmt, amt));
                amt += d_amt;
            }
        }
        
        function traceBlendedShape(a, b, blendAmt, amt) {
            return lerp2d(a.trace(amt), b.trace(amt), blendAmt, p);
        }
    };
}