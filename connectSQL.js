/**
 * Created by gonglixue on 2017/4/8.
 */
var pg = require('pg');
var config = require('./config');

var conString = config.pg_connectStr;
var client = new pg.Client(conString);

function select(client){
    client.query("select * from job;", function(error, results){
        if(error){
            console.log("select error");
            console.log(error.message);
            client.end();
            return;
        }
        if(results.rowCount > 0){
            console.log(results.rows[0]);
        }
    })
}

client.connect(function(error, results){
    if(error){
        console.log('client connection error');
        console.log(error.message);
        client.end();
        return;
    }
    select(client);
    console.log("client.connect OK. \n");
})
