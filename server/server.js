var http = require('http');
var url = require('url');
var path = require('path');
var WebSocketServer = require('websocket').server;
var jsonfile = require('jsonfile');

// Connected WebSocket clients
var clients = [];
var scores = [];
var port = 8888;
var scoresFile = path.resolve(__dirname, 'scores.json');

jsonfile.readFile(scoresFile, function(err, json) {
    if (!err) scores = json.data;
});

function start(route, handlers) {

    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        var query = url.parse(request.url).query;

        console.log('Request for ' + pathname + ' received.');

        route(pathname, handlers, response, query, clients);

        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('Hello! This is WebSocket Server for MokoCrush.');
        response.end();
    }

    var server = http.createServer(onRequest).listen(port, function() {
        console.log('Server has started and is listening on port ' + port);
    });

    var wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });

    // sort by highest scores and response top 10
    function sendScores(conn) {
        scores.sort(function(a, b) {
            return a.scores < b.scores ? 1 : -1;
        });
        conn.send(JSON.stringify(scores.slice(0, 10)));
    }

    function onWsConnClose(reasonCode, description) {
        console.log('Peer disconnected with reason: ' + reasonCode);
    }

    function onWsRequest(request) {

        var connection;

        // Catch not support exception
        try {
            var connection = request.accept('game-protocol', request.origin);
            sendScores(connection);
        } catch (err) {
            console.log('WebSocket protocol NOT accepted.');
            return;
        }

        console.log('WebSocket connection accepted.');

        // Save clients (unlimited clients)
        clients.push(connection);

        connection.on('message', function(message) {
            if (message.type == 'utf8') {
                console.log('Received message: ' + message.utf8Data);

                scores.push(JSON.parse(message.utf8Data));
                jsonfile.writeFile(scoresFile, { data: scores }, function(err) {
                    if (err) console.log('Score file write error!');
                });
                sendScores(connection);

            } else if (message.type == 'binary') {
                console.log('Received binary data.');
            }
        });
        connection.on('close', onWsConnClose);
    }

    wsServer.on('request', onWsRequest);
}

// Export functions
exports.start = start;
