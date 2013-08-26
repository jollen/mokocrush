jewel.screens["high-scores"] = (function() {
    var json = {};
    var ws = new WebSocket("ws://127.0.0.1:8888/", "game-protocol");
    ws.onmessage = wsOnMessage;
    ws.onopen = function() {
        console.log("WebSocket rocks");
    };
    ws.onclose = function() {
        console.log("Close");
        console.log(ws);
    };
    ws.onerror = function(e) {
        console.log('error');
    };

    function wsOnMessage(message) {
        json = JSON.parse(message.data);
        showScoreboard();
    }

    function sendScores(score) {
        console.log(score);
        ws.send(JSON.stringify(score));
    }

    function showScoreboard() {
        json.sort(function(a, b) {
            if (a.scores < b.scores) {
                return 1;
            } else if (a.scores > b.scores) {
                return -1;
            } else {
                return 0;
            }
        });
        $('#scoresList').html($.tmpl($("#scoresTemplate").html(), json));

    }

    function run() {

    }

    function setup() {

    }

    return {
        run : run,
        sendScores: sendScores
    };
})();
