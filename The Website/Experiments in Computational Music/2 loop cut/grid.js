function grid(parent) {
    return function(p5) {
        p5.setup = function() {
            for (var i=0; i<6; i++) {
                addCheckbox(i);
            }
        }
        
        p5.draw = function() {}
        
        function addCheckbox(i) {
            //div
            var div = p5.createDiv('');
            div.parent(parent);
            div.class('toggle');
            div.id('toggle ' + i);
            //div.position(x,y);
            //div.touchStarted(callback);

            //input
            var input = p5.createInput();
            input.parent(div);
            input.attribute('type', 'checkbox');
            input.id('input ' + i);
            input.parent(div);
            console.log(input.size());
            document.getElementById('input ' + i).checked = true;

            //label
            var label = p5.createElement('label');
            label.attribute('for', 'input ' + i);
            label.id('label ' + i);
            label.parent(div);

            return input;
        }
    };
}