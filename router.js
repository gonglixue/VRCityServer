/**
 * Created by gonglixue on 2017/4/5.
 */
var url = require("url");
function route(handler, request, response)
{
    var pathname = url.parse(request.url).pathname;
    if(typeof(handler[pathname]) === "function")
    {
        return handler[pathname](request, response);
    }
    else{
        console.log("no request for " + pathname);
        response.writeHead(404, {'Content-Type':'text/plain'});
        response.write("404 not found");
        response.end();
    }
}

exports.route = route;