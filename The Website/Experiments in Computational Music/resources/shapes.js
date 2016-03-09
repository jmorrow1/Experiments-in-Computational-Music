function Arc(x, y, halfwidth, halfheight, start, stop, p) {
    this.display = function() {
        p.ellipseMode(p.RADIUS);
        p.arc(x, y, halfwidth, halfheight, start, stop);
    }
}

function Line(x1, y1, x2, y2, p) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    
    this.display = function() {
        p.line(this.x1, this.y1, this.x2, this.y2);
    }
    
    this.trace = function(amt) {
        return {x:p.lerp(this.x1, this.x2, amt), y:p.lerp(this.y1, this.y2, amt)};
    }
    
    this.isVertex = function(amt, accuracy) {
        return (p.abs(1 - amt) < accuracy) || (p.abs(0 - amt) < accuracy);
    }
    
    this.scale = function(s1, s2) {
        this.x1 *= s1;
        this.y1 *= s2;
        this.x2 *= s1;
        this.y2 *= s2;
    }
    
    this.setLength = function(length) {
        var dif = length - this.getLength();
        var half_dif = 0.5*dif;
        this.x1 -= half_dif;
        this.x2 += half_dif;
    }
    
    this.getLength = function() {
        if (this.y1 == this.y2) {
            return this.x2-this.x1;
        }
        else {
            return p.dist(this.x1, this.y1, this.x2, this.y2);
        }
    }
    
    this.getAllVerticesInRange = function(startAmt, endAmt) {
        var vertices = [];
        if (startAmt <= 0) {
            vertices.push({x:this.x1, y:this.y1});
        }
        if (endAmt >= 1) {
            vertices.push({x:this.x1, y:this.y1});
        }
        return vertices;
    }
    
    this.toString = function() {
        return "x1 = " + this.x1 + ", y1 = " + this.y1 + ", x2 = " + this.x2 + ", y2 = " + this.y2;
    }
}

function Ellipse(x, y, halfwidth, halfheight, p) {
    this.x = x;
    this.y = y;
    this.halfwidth = halfwidth;
    this.halfheight = halfheight;
    
    this.display = function() {
        p.ellipseMode(p.RADIUS);
        p.ellipse(x, y, halfwidth, halfheight);
    }
    
    this.trace = function(amt) {
        var angle = amt * p.TWO_PI;
        return {x:this.x + p.cos(angle)*this.halfwidth, y:this.y + p.sin(angle)*this.halfheight};
    }
    
    this.isVertex = function(amt, accuracy) {
        return false;
    }
    
    this.getAllVerticesInRange = function(startAmt, endAmt) {
        return [];
    }
    
    this.highlight = function(amt1, amt2, color) {
        var angle1 = amt1 * p.TWO_PI;
        var angle2 = amt2 * p.TWO_PI;
        p.ellipseMode(p.RADIUS);
        p.noFill();
        p.stroke(color);
        p.strokeWeight(2);
        p.arc(x, y, halfwidth, halfheight, angle1, angle2);
    }
    
    this.toString = function() {
        return "x = " + this.x + ", y = " + this.y + ", width = " + (this.halfwidth*2) + ", height = " + (this.halfheight*2);
    }
    
}

function Rect(x, y, w, h, p) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

	this.display = function() {
		p.rectMode(p.CENTER);
		p.rect(this.x, this.y, this.w, this.h);
	}

    this.translate = function(dx, dy) {
        this.x += dx;
        this.y += dy; 
    }
    
    this.touches = function(x, y) {
        return this.x1() <= x && x < this.x2() && this.y1() <= y && y <= this.y2();
    }
            
    this.x1 = function() {
        return this.x - 0.5*this.w;
    }
    
    this.y1 = function() {
        return this.y - 0.5*this.h;
    }
    
    this.x2 = function() {
        return this.x + 0.5*this.w;
    }
    
    this.y2 = function() {
        return this.y + 0.5*this.h;
    }

	this.toString = function() {return "Rect(x = " + this.x + ", y = " + this.y + ", w = " + this.w + ", h = " + this.h + ")";}
}

function RegularPolygon(x, y, radius, numSides, p, startAngle) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.numSides = numSides;
    if (startAngle != undefined) {
        this.startAngle = startAngle;
    }
    else {
        this.startAngle = 0;
    }
    
    this.display = function() {
        p.beginShape();
            var angle = this.startAngle;
            var endAngle = p.TWO_PI + this.startAngle;
            var d_angle = p.TWO_PI / this.numSides;
            while (angle < endAngle) {
                p.vertex(this.x + p.cos(angle)*this.radius, this.y + p.sin(angle)*this.radius);
                angle += d_angle;
            }
        p.endShape(p.CLOSE);
    }
    
    this.trace = function(amt) {
        var a = 1 / this.numSides;
        var sideNum = p.int(amt/a);
        var d_angle = p.TWO_PI / this.numSides;
        var angle = d_angle * sideNum;
        angle += this.startAngle;
        
        var x1 = this.x + p.cos(angle)*this.radius;
        var y1 = this.y + p.sin(angle)*this.radius;
        
        angle += d_angle;
        
        var x2 = this.x + p.cos(angle)*this.radius;
        var y2 = this.y + p.sin(angle)*this.radius;
        
        amt %= a;
        amt = p.map(amt, 0, a, 0, 1);
        
        return {x:p.lerp(x1, x2, amt), y:p.lerp(y1, y2, amt)};
    }
    
    this.isVertex = function(amt, accuracy) {
        var a = 1 / this.numSides;
        var remainder = amt % a;
        return (remainder < accuracy);
    }
    
    this.getAllVerticesInRange = function(startAmt, endAmt) {
        var increment = 1 / this.numSides;
        var amt = p.int(startAmt / increment)*increment;
        if (startAmt % 1 != 0) amt += increment;
        var vertices = [];
        while (amt <= endAmt) {
            vertices.push(this.trace(amt));
            amt += increment;
        }
        return vertices;
    }
    
    this.toString = function() {
        return "x = " + this.x + ", y = " + this.y + ", radius = " + this.radius + ", numSides = " + this.numSides;
    }
}