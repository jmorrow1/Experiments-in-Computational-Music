function proto(p5) {
    //dividing line between melody creation section and function creation section
    var dividing_x;

    //boxes
    var melodyBoxes = [];

    //ui interaction
    var selectedRect = false;
    var selected_off_x, selected_off_y;
    function selectBox(box) {
        if (box.touches(p5.mouseX, p5.mouseY)) {
            selectedRect = box;
            selected_off_x = box.x - p5.mouseX;
            selected_off_y = box.y - p5.mouseY;
        }
    }

    p5.setup = function() {
        p5.createCanvas(800, 400);
        dividing_x = p5.width*0.7;
        melodyBoxes.push(new Rect(100, 100, 100, 50, p5));
    }
    
    p5.draw = function() {
        p5.background(220);
        p5.line(dividing_x, 0, dividing_x, p5.height);
        melodyBoxes.forEach(function(r) {
            r.display();
        });
    }

    p5.mousePressed = function() {
        if (p5.mouseX < dividing_x) {
            melodyBoxes.forEach(selectBox);
        }
    }

    p5.mouseDragged = function() {
        if (selectedRect != false) {
            selectedRect.x = p5.mouseX + selected_off_x;
            selectedRect.y = p5.mouseY + selected_off_y;
        }
    }

    p5.mouseReleased = function() {
        selectedRect = false;
    }
}

/***********************************
 ***** Array Utility Functions *****
 ***********************************/

//Returns a new array which is the same as this array without its first and last elements.
Array.prototype.guts = function() {
    if (this.length > 2) {
        return this.slice(1, this.length-1)
    }
    else {
        return [];
    }
}

//A pure version of reverse (returns a reversed array, causing no side effects on this array).
Array.prototype.reverse1 = function() {
    return this.slice(0, this.length).reverse();
}

//Sums an array of numbers.
Array.prototype.sum = function() {
    return this.reduce(function(a, b) {return a + b;});
}

/***************************
 ***** Melody Stepping *****
 ***************************/

Array.prototype.get = function(index) {
    if (this.length > 0) {
        return this[remainder(index, this.length)];
    }
}

Array.prototype.bounce = function(index) {
    return this.concat(this.reverse1().guts());
}

Array.prototype.traverse = function(stepSeq) {
    var newArray = [];

    var i = 0; //enumerates through newArray
    var pos = 0; //steps through this
    var j = 0; //enumerates through stepSeq

    do {
        newArray[i++] = this.get(pos);
        pos = (pos + stepSeq[j]) % this.length;
        j = (j+1) % stepSeq.length;
    }
    while (pos != 0 || j != 0);

    return newArray;
}

function remainder(num, denom) {
    if (0 <= num && num < denom) {
        return num;
    }
    else if (num > 0) {
        return num % denom;
    }
    else {
        return (denom - ((-num) % denom)) % denom;
    }
}