/**
 * Created by gonglixue on 2017/4/8.
 */
var pg = require('pg');
var config = require('./config');
var xmldom = require('xmldom');

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
    //console.log("client.connect OK. \n");
    genKML();
})

// 构造Layer.KML
function genKML(){
    var basicStructureXML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n\
    <kml xmlns:xal="urn:oasis:names:tc:ciq:xsdschema:xAL:2.0" xmlns="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:gx="http://www.google.com/kml/ext/2.2">\n\
    <Document>\n\
        <name>Layer_absolute</name>\n\
        <open>true</open>\n\
        <LookAt>\n\
            <longitude>13.3917246272232</longitude>\n\
            <latitude>52.538477938969024</latitude>\n\
            <altitude>0.0</altitude>\n\
            <heading>0.0</heading>\n\
            <tilt>60.0</tilt>\n\
            <range>970.0</range>\n\
        </LookAt>\n\
        <Style id="frameStyle">\n\
            <LineStyle>\n\
                <width>4.0</width>\n\
            </LineStyle>\n\
        </Style>\n\
        <Placemark>\n\
            <name>Tile border</name>\n\
            <styleUrl>#frameStyle</styleUrl>\n\
            <LineString>\n\
                <tessellate>true</tessellate>\n\
                <coordinates>13.381512759037726,52.53244656281135 13.401936495408673,52.53244656281135 13.401936495408673,52.5445093151267 13.381512759037726,52.5445093151267 13.381512759037726,52.53244656281135</coordinates>\n\
            </LineString>\n\
        </Placemark>\n\
    </Document>\n\
    </kml>'

    var doc = new xmldom.DOMParser().parseFromString(basicStructureXML);

    var Flolder = doc.createElement("Folder");

    var test = doc.documentElement.getElementsByTagName("range")[0].nodeValue;
    console.log(test);
}