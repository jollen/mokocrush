var WebSocketServer = require('websocket').server;
var http = require('http');
var url = require('url');

// Connected WebSocket clients
var clients = [];
var scores = [];
var port = 8888;

var scores = [
    { name: "Jollen", scores: 5300 },
    { name: "Ellaine", scores: 2580 },
    { name: "Hank", scores: 1000 },
    { name: "Sherry", scores: 11100 },
    { name: "Jordan", scores: 35600 },
    { name: "Michale", scores: 26400 },
    { name: "Mary", scores: 26400 },
    { name: "Mark", scores: 400 },
    { name: "Justin", scores: 3000 },
    { name: "Avril", scores: 5600 },
    { name: "James", scores: 3360 }
];

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
