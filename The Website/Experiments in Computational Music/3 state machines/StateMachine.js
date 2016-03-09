//super simple, read-only state machine representation.
//safety checking is left entirely up to the user.

//these things must be true:
    //aMatrix must be a 2d array
    //for every row r in aMatrix, r.length must be equal to aMatrix.length
    //the argument, currentStateIndex, passed to doTransition must
        //be an integer
        //be such that (0 <= currentStateIndex && currentStateIndex < states.length) evaluates to true.
    //it's assumed that each row in aMatrix sums to exactly 1.

function StateMachine(aMatrix) {
    var numStates = aMatrix.length;
    
    this.doTransition = function(currentStateIndex) {
        var r = Math.random();
        var pos = aMatrix[currentStateIndex];
        
        var sum = 0;
        
        for (var i=0; i<numStates; i++) {
            sum += pos[i];
            if (r >= sum) {
                currentStateIndex = i;
                break;
            }
        }
    }
    
    this.toString = function() {
        var string = '[';
        
        var i=0; 
        while (i < numStates) {
            string += '[';
            string += aMatrix[i].toString();
            string += ']';
            i++;
            if (i < numStates) {
                string += ',';
            }
        }
        
        string += ']';
        
        return string;
    }
}