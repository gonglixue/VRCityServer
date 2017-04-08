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

exports.configItem = configItem;
exports.pg_connectStr = pg_connectStr;