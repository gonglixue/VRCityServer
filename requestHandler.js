/**
 * Created by gonglixue on 2017/4/5.
 */
var url = require("url");
var fs = require("fs");
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
// params: latitude ,longitude, tilesIDX, tilesIDY
function loadTileKML(request, response)
{

}

exports.loadKML = loadKML;