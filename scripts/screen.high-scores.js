jewel.screens["high-scores"] = (function() {
    var json = {};

    var ws = new WebSocket("ws://"+location.hostname+':8888', "game-protocol");
    // var ws = new WebSocket("ws://direct.mokoversity.com:8888/", "game-protocol");
    ws.onmessage = function(message) {
        json = JSON.parse(message.data);
        $('#scoresList').html($.tmpl($("#scoresTemplate").html(), json));
    };
    ws.onopen = function() {
        console.log("WebSocket rocks");
    };
    ws.onclose = function() {
        console.log("Close");
    };
    ws.onerror = function(e) {
        console.log('error');
    };

    function sendScores(scoreData) {
        console.log('Send score to server through WebSocket');
        ws.send(JSON.stringify(scoreData));
    }

    function run() {

    }

    return {
        run: run,
        sendScores: sendScores
    };
})();
