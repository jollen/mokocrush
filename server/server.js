var WebSocketServer = require('websocket').server;
var http = require('http');
var url = require('url');

// Connected WebSocket clients
var clients = [];
var scores = [];
var port = 8888;

var scores = [
    { name: "Jollen", scores: 50 },
    { name: "Frank", scores: 100 },
    { name: "Ellaine", scores: 258 }
];

function start(route, handlers) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        var query = url.parse(request.url).query;

        console.log('Request for ' + pathname + ' received.');

        route(pathname, handlers, response, query, clients);

        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('Hello World');
        response.end();
    }

    var server = http.createServer(onRequest).listen(port, function() {
        console.log('Server has started and is listening on port ' + port);
    });

    wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });



    function onWsConnClose(reasonCode, description) {
        console.log('Peer disconnected with reason: ' + reasonCode);
    }

    function onWsRequest(request) {
        var connection;

        // Catch not support exception
        try {
            var connection = request.accept('game-protocol', request.origin);
            connection.send(JSON.stringify(scores));
        } catch (err) {
            console.log('WebSocket protocol NOT accepted.');
            return;
        }

        console.log('WebSocket connection accepted.');

        // Save clients (unlimited clients)
        clients.push(connection);

        connection.on('message', function onWsConnMessage(message) {
            if (message.type == 'utf8') {
                console.log('Received message: ' + message.utf8Data);

                scores.push(JSON.parse(message.utf8Data));
                connection.send(JSON.stringify(scores));

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
