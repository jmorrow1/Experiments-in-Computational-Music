Array.prototype.removeAt = function(index) {
    var elem = this[index];
    this.splice(index, 1);
    return elem;
}

function generateRandomRhythm(subdivision, duration, noteChance, sound) {
    var notes = [0];
    var beat = subdivision;
    while (beat < duration) {
        if (Math.random(1) < noteChance) {
            notes.push(beat);
        }
        beat += subdivision;
    }
    return new Rhythm(notes, duration, sound);
}

function generateNNoteRhythm(subdivision, duration, numNotes, sound) {   
    var slots = [true];
    var size = duration / subdivision;
    for (var i=1; i<size; i++) {
        slots[i] = false;
    }
    
    var numNotesChosen = 1;
    if (numNotesChosen <= size) {
        while (numNotesChosen < numNotes) {
            var n = Math.floor(size * Math.random());
            if (!slots[n]) {
                slots[n] = true;
                numNotesChosen++;
            }
        }
    }
    
    var notes = [];
    var beat = 0;
    for (var i=0; i<size; i++) {
        if (slots[i]) {
            notes.push(beat);
        }
        beat += subdivision;
    }
    
    return new Rhythm(notes, duration, sound);
}

function EmbeddedShape(rhythm, shape, p) {        
    this.update = function(dotSize, neutralColor, brightColor, beatpt, doPlay) {
        if (doPlay) {
            //play sounds
            rhythm.play(beatpt);
        }
        
        //normalize beatpt
        beatpt %= rhythm.duration;
        var amt = p.map(beatpt, 0, rhythm.duration, 0, 1);
        
        //draw
        p.stroke(neutralColor);
        shape.display();
        
        shape.highlight(0, amt, brightColor);
        
        embedRhythm(rhythm, shape, dotSize, neutralColor, brightColor, amt, p); 
    }

    this.rhythm = function(value) {
        if (value == undefined) {
            return rhythm;
        }
        else {
            rhythm = value;
        }
    }

    this.shape = function(value) {
        if (value == undefined) {
            return shape;
        }
        else {
            shape = value;
        }
    }
}

function embedRhythm(rhythm, shape, dotSize, neutralColor, brightColor, beatAmt, p) {
    p.noStroke();
    p.ellipseMode(p.CENTER);
    for (var i=0; i<rhythm.numNotes(); i++) {
        var noteAmt = p.map(rhythm.getNote(i), 0, rhythm.duration, 0, 1);
        var pt = shape.trace(noteAmt);

        if (beatAmt >= noteAmt) {
            p.fill(brightColor);
        }
        else {
            p.fill(neutralColor);
        }
        p.ellipse(pt.x, pt.y, dotSize, dotSize);
    }
}

function meshuggify(rhythm, finalDuration) {
    if (rhythm.numNotes() == 0) return rhythm;
    
    var notepts = [];
    var repeatNum = 0;

    var i=0; //loops through rhythm
    
    var t = rhythm.getNote(i);
    
    while (t < finalDuration) {
        //push the new note
        notepts.push(t);    
        //increment i
        i++;
        if (i >= rhythm.numNotes()) {
            i = 0;
            repeatNum++;
        }
        //set t
        t = repeatNum*rhythm.duration + rhythm.getNote(i);
    }
    
    return new Rhythm(notepts, finalDuration, rhythm.sound);
}

//representation of a rhythm as a 1d line that contains points indicating notes:
function Rhythm(notes, duration, sound) {
    //rhythm structure data:
    this.notes = notes;
    this.duration = duration;
    
    //sound data:
    this.sound = sound;
    
    //play logic:
    this.index = 0;
    this.wait = false;
    this.lastBeatPt = 0;
    
    this.play = function(beatpt) {
        if (this.wait && beatpt < this.lastBeatPt) {
            this.wait = false; 
        }
        
        if (!this.wait) {
            if (beatpt >= this.notes[this.index]) {
                this.sound.play();
                this.index++;
                if (this.index == this.notes.length) {
                    this.index = 0;
                    this.wait = true;
                }
            }
        }
        
        this.lastBeatPt = beatpt;
    }
    
    this.numNotes = function() {
        return notes.length;
    }
    
    this.getNote = function(i) {
        return notes[i];
    }
    
    this.incrementIndex = function() {
        this.index++;
        if (this.index == this.notes.length) {
            this.index = 0;
            this.wait = true;
        }
        this.lastBeatPt = this.notes[this.index];
    }
    
    this.clone = function() {
        var notesClone = [];
        for (var i=0; i<this.notes.length; i++) {
            notesClone[i] = this.notes[i];
        }
        return new Rhythm(notesClone, this.duration, this.sound);
    }
}

function lerp2d(a, b, amt, p) {
	return {x : p.lerp(a.x, b.x, amt), y : p.lerp(a.y, b.y, amt)};
}