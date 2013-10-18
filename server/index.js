var server = require("./server");
var router = require("./router");
var handlers = require("./requestHandlers");

// Use Object to mapping pathname and request handlers
var handlers = {
   "/": handlers.start,
   "/start": handlers.start,
   "/save": handlers.save
};

// Send request handler
server.start(router.route, handlers);
