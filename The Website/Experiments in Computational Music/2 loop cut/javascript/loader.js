var waveforms = [];

function setup() {
    loadLoops();
    loadGrids();
}

function loadLoops() {
    var loopsToLoad = 3;

    //start loading audio
    var loops = [loadSound(["loops/loop 1.mp3", "loops/loop 1.ogg"], load),
                 loadSound(["loops/loop 2.mp3", "loops/loop 2.ogg"], load),
                 loadSound(["loops/loop 3.mp3", "loops/loop 3.ogg"], load)];

    //when all audio is loaded, create waveforms
    function load() {
        loopsToLoad--;
       
        if (loopsToLoad == 0) {
            loadSet1();
            loadSet2();
        }
    }

    //create the first set of waveforms
    function loadSet1() {
        var maxDuration = max(loops[0].duration(), loops[1].duration());
        var canvasWidth = floor(20 * maxDuration);
        waveforms[0] = new p5(waveform('loop-1', loops[0], 'loop 1', floor(20 * loops[0].duration()), canvasWidth));
        waveforms[1] = new p5(waveform("loop-2", loops[1], 'loop 2', floor(20 * loops[1].duration()), canvasWidth));
    }

    //create the second set of waveforms
    function loadSet2() {
        var maxDuration = max([loops[0].duration(), loops[1].duration(), loops[2].duration()]);
        var canvasWidth = floor(20 * maxDuration);
        waveforms[2] = new p5(waveform("loop-1-reprise", loops[0], "order 1", floor(20 * loops[0].duration()), canvasWidth));
        waveforms[3] = new p5(waveform("loop-2-reprise", loops[1], "order 2", floor(20 * loops[1].duration()), canvasWidth));
        waveforms[4] = new p5(waveform("loop-3", loops[2], "order 3", floor(20 * loops[2].duration()), canvasWidth));
    }
}

function loadGrids() {
    var grid1 = grid("grid-1");
    new p5(grid1);
}

function stopAllPlayback() {
    for (var i=0; i<waveforms.length; i++) {
        waveforms[i].stopPlayingLoop();
    }
}