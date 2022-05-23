var term = 'Internet'

var answer = term.toUpperCase();
var numGuess = 0;
var guess = "";
var curRow = "row1";
var activeGameTiles = document.getElementsByClassName(curRow);
var keyboardTiles = document.getElementsByClassName("keyboard-tile");


//create game tiles based on answer length
var container = document.getElementsByClassName("game-guess-container");
const rows = ['row1', 'row2', 'row3'];
for(var i=0; i < answer.length; i++) {
    for(var j=0; j < 3; j++) {
        //create text node to hold guess letter
        var text = document.createTextNode('');
        
        //create paragraph to attach text node to
        var para = document.createElement('p');
        para.classList.add("game-tile-letter");
        para.appendChild(text);

        //create div
        var div = document.createElement('div');
        div.classList.add("game-tile");
        div.classList.add(rows[j]);
        div.appendChild(para);
        
        //append div
        container[0].appendChild(div);
    }
}

//displays the pending guess in tiles
function display(str) {
    for(var i = 0; i < answer.length; i++){
        var gameTile = activeGameTiles[i].firstChild; //saves typing
        //remove any text in game tiles
        if(gameTile.hasChildNodes()){
            gameTile.removeChild(gameTile.firstChild);
        }
        //add text to game tiles
        if(str[i]){
            var text = document.createTextNode(str[i]);
            gameTile.appendChild(text);
        }
    }
}

//highlights keyboard tile
function keyboardHighlight(char, color) {
    //for each game tile
    for(var i = 0; i < keyboardTiles.length; i++) {
        if(keyboardTiles[i].firstChild.textContent === char) {
            //if tile is green, do not update
            if(keyboardTiles[i].style["background-color"] === '#46E72D') {
                return;
            }
            else {
                //if tile is not green and needs to be green or yellow, update color
                if(color === '#46E72D' || color === 'yellow') {
                    keyboardTiles[i].style["background-color"] = color;
                }
                //only make tile gray if it is not already yellow
                if(color === 'gray') {
                    if(keyboardTiles[i].style["background-color"] === 'yellow') {
                        return;
                    }
                    else {
                        keyboardTiles[i].style["background-color"] = 'gray';
                    }
                }
            }
        }
    }
}

//colors tiles when a guess is submitted
function highlight(row) {
    activeGameTiles = document.getElementsByClassName(row);
    //for each game tile
    for(var j = 0; j < activeGameTiles.length; j++) {
        //if letter in guess matches answer, highlight green
        if(activeGameTiles[j].firstChild.textContent === answer[j]){
            activeGameTiles[j].style["background-color"] = '#46E72D';
            keyboardHighlight(answer[j], '#46E72D');
        }
        //if letter in guess does not match the answer
        else {
            //if letter exists elsewhere in the word, highlight yellow
            //otherwise, highlight gray
            var flag = false;
            for(var k = 0; k < answer.length; k++) {
                if(activeGameTiles[j].firstChild.textContent === answer[k]) {
                    flag = true;
                    break;
                }
            }
            if(flag){
                activeGameTiles[j].style["background-color"] = 'yellow';
                keyboardHighlight(activeGameTiles[j].firstChild.textContent, 'yellow');
            }
            else {
                activeGameTiles[j].style["background-color"] = 'gray';
                keyboardHighlight(activeGameTiles[j].firstChild.textContent, 'gray');
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
                highlight(curRow);
                
                //move to next row
                numGuess++;
                numGuess === 1 ? curRow = "row2" : curRow = "row3";
                activeGameTiles = document.getElementsByClassName(curRow);
                
                //delete guess, unless on final submission
                numGuess === 3 ? guess = guess : guess = "";
            }
        }
        else if(key.length === 1 && guess.length < answer.length) {
            guess += key.toUpperCase();
        }
        display(guess);
    }
};