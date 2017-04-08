/**
 * Created by gonglixue on 2017/4/5.
 */
var http = require("http");
var url = require("url");

function start(route, handler, client)
{
    console.log('start server');
    function onRequest(request, response)
    {
        route(handler, request, response);
    }

    http.createServer(onRequest).listen(8888);
}

exports.start = start;