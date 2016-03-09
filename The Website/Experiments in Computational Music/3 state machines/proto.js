function proto(p5) {
    //logic:
    var currentStateIndices = [0];
    var machineLogic = new StateMachine([[0.75, 0.25],
                                         [0.50, 0.50]]);
    //graphics:
    var stateGraphics = [];
    
    p5.setup = function() {
        p5.createCanvas(400, 200);
    }
    
    p5.draw = function() {
        p5.background(240);
    }
}