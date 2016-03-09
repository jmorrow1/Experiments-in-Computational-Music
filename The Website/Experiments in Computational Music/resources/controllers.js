function GUI(p) {
    var controllers = [];
    
    this.addController = function(x1, y1, width, height, minValue, maxValue) {
        var s = new Slider(x1, y1, width, height, minValue, maxValue);
        controllers.push(s);
        return s;
    }
    
    this.addButton = function(x, y, width, height) {
        var b = new Button(x, y, width, height);
        controllers.push(b);
        return b;
    }
    
    this.draw = function() {
        for (var i=0; i<controllers.length; i++) {
            controllers[i].draw(p);
        }
    }
    
    this.mouseMoved = function() {
        for (var i=0; i<controllers.length; i++) {
            if (controllers[i].touches(p.mouseX, p.mouseY)) {
                controllers[i].hoveredOver = true;
            }
            else {
                controllers[i].hoveredOver = false;
            }
        }
    }
    
    this.mousePressed = function() {
        for (var i=0; i<controllers.length; i++) {
            if (controllers[i].touches(p.mouseX, p.mouseY)) {
                controllers[i].active = !controllers[i].active;
                controllers[i].makeCallback();
            }
        }
    }
}

function Slider(x1, y1, width, height, minValue, maxValue) {
    //positioning and sizing:
    this.x1 = x1;
    this.y1 = y1;
    this.width = width;
    this.height = height;
    //variable value:
    this.value = minValue;
    this.minValue = minValue;
    this.maxValue = maxValue;
    //ui state:
    this.hoveredOver = false;
    this.active = false;
    
    this.touches = function(x, y) {
        return this.x1 < x && x < this.x1 + this.width
            && this.y1 < y && y < this.y1 + this.height;
    }
    
    this.backgroundStyle = function(p) {
        p.stroke(0);
        p.fill(255);
    }
    
    this.foregroundStyle = function(p) {
        p.noStroke();
        p.fill(150);
    }
    
    this.draw = function(p) {
        this.backgroundStyle(p);
        p.rectMode(p.CORNER);
        p.rect(this.x1, this.y1, this.width, this.height);
        this.foregroundStyle(p);
        //draw horizontal slider
        var x = p.map(value, minValue, maxValue, this.x1, this.x1 + this.width);
        p.rect(this.x1, this.y1, x - this.x1, this.height);
    }
    
    this.makeCallback = function() {
        this.callback(this.value);
    }
    
    this.callback = function(value) {}
}

function Button(x, y, width, height) {
    //positioning and sizing:
    this.cenx = x;
    this.ceny = y;
    this.width = width;
    this.height = height;
    //ui state
    this.hoveredOver = false;
    this.active = false;
    
    this.touches = function(x, y) {
        return this.cenx - this.width/2 < x && x < this.cenx + this.width/2
            && this.ceny - this.height/2 < y && y < this.ceny + this.height/2;
    }
    
    this.style = function(p) {
        p.noStroke();
        if (this.active) {
            p.fill(0);
        }
        else if (this.hoveredOver) {
            p.fill(100);
        }
        else {
            p.fill(255);
        }
    }
    
    this.draw = function(p) {
        style(p);
        p.rectMode(p.CENTER);
        p.rect(this.cenx, this.ceny, this.width, this.height);
    }
    
    this.makeCallback = function() {
        callback(this.active);
    }
    
    this.callback = function(isActive) {}
}