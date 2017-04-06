/**
 * Created by gonglixue on 2017/4/5.
 */
var url = require("url");
var fs = require("fs");
var querystring = require("querystring");

// method: GET
// params: latitude, longitude
function loadKML(request, response)
{
    console.log("request handler: loadKML");
    fs.readFile("./tmp/Layer2.kml","utf8", function(error, data){
        if(error)
        {
            response.writeHead(500, {'Content-Type':'text/plain'});
            response.write(error + "\n");
            response.end();
        }
        else{
            response.writeHead(200, {'Content-Type':'text/xml'});
            response.write(data);
            response.end();
        }
    })

}

// method: GET
// params: cityName idX idY
function loadTileKML(request, response)
{
    console.log("request handler: loadTime");
    var myUrl = url.parse(request.url);
    var queryStr = myUrl.query;
    var params = querystring.parse(queryStr);

    console.log(params);
    response.writeHead(200, {'Content-Type':'application/json'});
    response.write(JSON.stringify(params));
    response.end();
}

function downloadFile(request, response)
{
    var pathname = url.parse(request.url).pathname;
    console.log("look up file: " + pathname);
    fs.readFile('./tmp' + pathname, "binary", function(error, data){
        if(error){
            response.writeHead(500, {'Content-Type':'text/plain'});
            response.write(error + "\n");
            response.end();
        }else{
            response.writeHead(200, {'Content-Type':'application/octet-stream'});
            response.write(data,"binary");
            response.end();
        }
    })
}

exports.loadKML = loadKML;
exports.loadTileKML = loadTileKML;
exports.downloadFile = downloadFile;