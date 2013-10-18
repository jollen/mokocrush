function route(pathname, handlers, response, query, clients) {
    console.log("Route this request: '" + pathname + "'");

    // Check pathname mapping any request handlers
    if (typeof handlers[pathname] == "function") {
        handlers[pathname](response, query, clients);
    } else {
        console.log("No request handler for this pathname: '" + pathname + "'");
    }
}

exports.route = route;
