/**
 * Created by gonglixue on 2017/4/8.
 */
var configItem = {
    address: '127.0.0.1:5432',
    username: 'postgres',
    password: 'gonglixue',
    //db:'CityModelX',
    db:'testdb'
};

var pg_connectStr = "postgres://" + configItem.username + ":" +
    configItem.password + "@" + configItem.address + "/" + configItem.db;

var tileConfig = {
    boundary:{
        west: 13.381512759037726,
        east: 13.401936495408673,
        south: 52.53244656281135,
        north: 52.5445093151267
    },
    tileCountX:11,
    tileCountY:11,
    tileWidth: 0.0018567033064497646,
    tileHeight: 0.0010966138468501445
}

exports.configItem = configItem;
exports.pg_connectStr = pg_connectStr;
exports.tileConfig = tileConfig;