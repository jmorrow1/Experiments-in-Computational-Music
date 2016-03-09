//musical data
var inputPattern, outputPattern;
//controllers
var gui;
var inputGrid, outputGrid;

function setup() {
    var canvas = createCanvas(600, 400);
    canvas.parent("app");
    highlightColor = select('.writing-entry-heading-text').style("color");
    
    textFont("Georgia");
    
    //init musical patterns
    inputPattern = [1, 1, 1, 0, 1, 0];
    outputPattern = [];
    for (var i=0; i<64; i++) {
        outputPattern.push(inputPattern[i % inputPattern.length]);
    }
    //init grids cooresponding to those musical patterns
    inputGrid = new Grid(50, 20, 16, 25, inputPattern);
    outputGrid = new Grid(50, height/4 + 10, 16, 25, outputPattern);
    
    gui = new GUI(this);
}

function draw() {
    background(50);
    inputGrid.draw();
    outputGrid.draw();
}

function mouseMoved() {
    gui.mouseMoved();
}

function mousePressed() {
    gui.mousePressed();
}

function Grid(x1, y1, maxRowSize, cellSize, notes) {
    this.x1 = x1;
    this.y1 = y1;
    this.maxRowSize = maxRowSize;
    this.cellSize = cellSize;
    this.notes = notes;
    
    this.pushNote = function(value) {
        this.notes.push(value);
    }
    
    this.popNote = function() {
        this.notes.pop();
    }
    
    this.cellAt = function(i) {
        if (0 <= i && i < this.notes.length) {
            var row = int(i / this.maxRowSize);
            var column = i % this.maxRowSize;
            var x = x1 + row * cellSize + cellSize/2;
            var y = y1 + column * cellSize + cellSize/2;
            
            return new Rect(x, y, cellSize, cellSize, this);
        }
    }
    
    this.draw = function() {
        var x = this.x1;
        var y = this.y1;

        var i=0; //loops through all cells
        var j=0; //loops through cells in a row 

        strokeWeight(2);
        rectMode(CORNER);
        stroke(255);

        while (i < this.notes.length) {

            //draw cells:
            if (this.notes[i] == 0) {
                fill(150);
            }
            else {
                fill(0);
            }
            rect(x, y, this.cellSize, this.cellSize);

            //increment looping variables:
            i++;
            j = (j+1) % this.maxRowSize;

            //increment positioning variables:
            if (j == 0) {
                x = this.x1;
                y += this.cellSize;
            }
            else {
                x += this.cellSize;
            }
        }
    }
}