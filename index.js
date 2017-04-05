/**
 * Created by gonglixue on 2017/4/5.
 */
var server = require('./server');
var router = require('./router');
var requestHandler = require('./requestHandler');

var handler = {};
handler["/"] = requestHandler.loadKML;
handler["/loadKML"] = requestHandler.loadKML;

server.start(router.route, handler);