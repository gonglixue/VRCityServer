/**
 * Created by gonglixue on 2017/4/5.
 */
var url = require("url");
var fs = require("fs");
var querystring = require("querystring");
var connectSQL = require("./connectSQL");

// method: GET
// params: latitude, longitude

function loadKML(request, response, client)
{
    var doc = connectSQL.genKML();
    if(doc){
        response.writeHead(200, {'Content-Type':'text/xml'});
        response.write(doc);
        response.end();
    }
    else{
        response.writeHead(500, {'Content-Type':'text/plain'});
        response.write("error");
        response.end();
    }
}


// method: GET
// params: cityName idX idY
function loadTileKML(request, response, client)
{
    //console.log("request handler: loadTile");
    var myUrl = url.parse(request.url);
    var queryStr = myUrl.query;
    var params = querystring.parse(queryStr);

    var filePath = "./Tiles/" + params.idx + "/" + params.idy + "/" +
        "Layer_absolute_Tile_" + params.idx + "_" + params.idy + "_collada.kml";

    connectSQL.queryTileKML(params.idx, params.idy, client, response); //在SQL操作回掉中做出HTTP 响应

    /*
    fs.readFile(filePath,"utf8", function(error, data){
        if(error){
            response.writeHead(500, {'Content-Type':'text/plain'});
            response.write(error, "\n");
            response.end();
        }else{
            response.writeHead(200, {'Content-Type':'text/xml'});
            response.write(data);
            response.end();
        }
    })
    */

}

// 请求.dae文件(xml)
function downloadFile(request, response)
{
    var pathname = url.parse(request.url).pathname;

    console.log("look up file: " + pathname);
    fs.readFile('.' + pathname, "utf8", function(error, data){
        if(error){
            response.writeHead(500, {'Content-Type':'text/plain'});
            response.write(error + "\n");
            response.end();
        }else{
            response.writeHead(200, {'Content-Type':'text/xml'});
            response.write(data);
            response.end();
        }
    })
}

// texture/ + path
function downloadTextureFile(request, response)
{
    var pathname = url.parse(request.url).pathname;
    pathname = pathname.substr(8);

    console.log("request texture: " + pathname);
    fs.readFile("." + pathname, "binary", function(error,data){
        if(error){
            response.writeHead(500, {'Content-Type':'text/plain'});
            response.write(error + "\n");
            console.log("load texture failed");
            response.end();
        }else{
            response.writeHead(200, {'Content-Type':'image/jpeg'});
            response.write(data,"binary");
            response.end();
        }
    })
}

// classData?month=j&year=2016
function requestClassData(request, response, client)
{
    var myUrl = url.parse(request.url);
    var queryStr = myUrl.query;
    var params = querystring.parse(queryStr);

    var month = parseInt(params.month);
    var year = parseInt(params.year);
    console.log("request class-data of: " + month +"month in " + year);

    connectSQL.queryWeatherClassData(month, year, client, response);
}

exports.loadKML = loadKML;
exports.loadTileKML = loadTileKML;
exports.downloadFile = downloadFile;
exports.downloadTextureFile = downloadTextureFile;
exports.requestClassData = requestClassData;