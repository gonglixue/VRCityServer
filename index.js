/**
 * Created by gonglixue on 2017/4/5.
 */
var server = require('./server');
var router = require('./router');
var requestHandler = require('./requestHandler');
var config = require('./config');
var pg = require('pg');

//路由表
var handler = {};
handler["/"] = requestHandler.loadKML;
handler["/loadKML"] = requestHandler.loadKML;
handler["/loadTileKML"] = requestHandler.loadTileKML
handler["file"] = requestHandler.downloadFile;
handler["texture"] = requestHandler.downloadTextureFile;
handler["classData"] = requestHandler.requestClassData;

// 连接数据库
var client = new pg.Client(config.pg_connectStr);
client.connect(function(error, results){
    if(error){
        console.log("Client connection error: " + error.message);
        client.end();
        return;
    }
    console.log("client.connect OK. \n");
    server.start(router.route, handler, client);
})

