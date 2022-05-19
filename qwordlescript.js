var answer = 'poopy';
var numGuess = 0;
var guess = "";
var curRow = "row1";
var activeGameTiles = document.getElementsByClassName(curRow);

//displays the pending guess in tiles
function display(str) {
    for(var i = 0; i < answer.length; i++){
        var gameTile = activeGameTiles[i].firstChild;
        if(gameTile.hasChildNodes()){
            gameTile.removeChild(gameTile.firstChild);
        }
        if(str[i]){
            var text = document.createTextNode(str[i]);
            gameTile.appendChild(text);
        }
    }
}

//colors tiles when a guess is submitted
function highlight(answer, guess, row) {
    activeGameTiles = document.getElementsByClassName(row);
    keyboardTiles = document.getElementsByClassName("keyboard-tile");
    for(var i = 0; i < answer.length; i++) {
        for(var j = 0; j < activeGameTiles.length; j++) {
            //if letter in guess matches answer
            if(activeGameTiles[j].firstChild.textContent == answer[j]){
                activeGameTiles[j].style["background-color"] = 'green';
            }
            //if letter in guess does not match the answer
            else {
                activeGameTiles[j].style["background-color"] = 'red';
            }
        }
    }
}

//listen for typing
document.onkeydown = function(e) { 
    if(numGuess < 3) {
        e = e || window.event;
        var key = e.key;
        if (key === 'Backspace') {
            guess = guess.slice(0, -1);
        }
        if (key === 'Enter') {
            if(guess && guess.length === answer.length){
                //highlight tiles
                highlight(answer, guess, curRow);
                
                //move to next row
                numGuess++;
                numGuess === 1 ? curRow = "row2" : curRow = "row3";
                activeGameTiles = document.getElementsByClassName(curRow);
                
                //delete guess, unless on final submission
                numGuess === 3 ? guess = guess : guess = "";
            }
        }
        else if(key.length === 1 && guess.length < answer.length) {
            guess += key;
        }
        display(guess);
    }
};