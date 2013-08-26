mokocrush
==========


## Code Review

### Organize Code

* html structure (index.html)
* game settings (loader.js)

### JavaScript

* bind both mouse and touch event (input.js L50:57)
* canvas (display.canvas.js L35:54)
* dom (dom.js)
* yepnope (loader.js L100)

### Server

* WebSocket (server.js)

### Algorithm

* swap (board.js L216:260)
* match three (board.js L74:104)


## Live Demo
	
* score board View
* receive / send score with WebSocket

### Progress

	
1. Added query and jquery-tmpl libs

	```
	<script src="scripts/jquery.min.js"></script>
	<script src="scripts/jquery.tmpl.min.js"></script>
	```

* high-scores template 

	```
	名字 分數
	<div id="scoresList"></div>
	<script id="scoresTemplate" type="text/x-jquery-tmpl">
	    <tr>
    	    <td>${name}</td>
        	<td>${scores}</td>
	    </tr>
	</script>
	```
* Create screen.high-scores.js
* Added screen.high-scores.js to Modernizr.load

	```
	"loader!scripts/screen.high-scores.js"
	```
	
* Send score when GameOver (screen.game.js L115)

	```
	jewel.screens['high-scores'].sendScores({
		name: "anonymous",
		scores: gameState.score
	});
	```

### Heavily based on HTML5 Games: Creating Fun with HTML5, CSS3, and WebGL's sample code.