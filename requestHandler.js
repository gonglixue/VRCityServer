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

    var filePath = "./Tiles/" + params.idx + "/" + params.idy + "/" +
        "Layer_absolute_Tile_" + params.idx + "_" + params.idy + "_collada.kml";

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
    // var dirPath = pathname.substring(0, pathname.lastIndexOf('/'));
    // console.log("dir path:" + dirPath);

    // fs.readdir('.'+pathname, function(err, filesName){
    //     filesName.forEach(function(filename){
    //         var postfix = filename.substr(filename.lastIndexOf('.')+1);
    //         console.log(postfix);
    //         if(postfix == "jpeg"){
    //             fs.readFile('.' + dirPath + '/' + filename, "binary", function(error, data){
    //                 console.log("find a jepg:" + filename);
    //                 if(error){
    //                     response.writeHead(500, {'Content-Type':'text/plain'});
    //                     response.write(error + "\n");
    //                     response.end();
    //                 }
    //                 else{
    //                     response.writeHead(200, {'Content-Type':'image/jpeg'});
    //                     response.write(data,"binary");
    //                     response.end();
    //                 }
    //             })
    //         }
    //     })
    // })
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
exports.loadKML = loadKML;
exports.loadTileKML = loadTileKML;
exports.downloadFile = downloadFile;
exports.downloadTextureFile = downloadTextureFile;