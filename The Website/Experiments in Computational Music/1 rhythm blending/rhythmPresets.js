function getRhythmPair(i, sound1, sound2) {
    var rhythms = [];
    if (i == 0) {
        rhythms[0] = new Rhythm([0, 0.25, 0.75, 1.25, 1.5], 2, sound1);
        rhythms[1] = new Rhythm([0, 0.75, 1.25, 1.5, 1.75], 2, sound2);
    }
    else if (i == 1) {
        rhythms[0] = new Rhythm([0, 1/3.0, 1, 1 + 2/3.0], 2, sound1);
        rhythms[1] = new Rhythm([0, 2/3.0, 1, 1 + 1/3.0], 2, sound2);
    }
    else if (i == 2) {
        var numNotes = Math.floor(Math.random()*3 + 4);
        rhythms[0] = generateNNoteRhythm(0.25, 2, numNotes, sound1);
        rhythms[1] = generateNNoteRhythm(0.25, 2, numNotes, sound2);
    }
    return rhythms;
}