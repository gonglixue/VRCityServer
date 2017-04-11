/**
 * Created by gonglixue on 2017/4/8.
 */
var pg = require('pg');
var config = require('./config');
var xmldom = require('xmldom');
var fs = require("fs");
//var libxml = require("libxmljs");

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
    //select(client);
    //console.log("client.connect OK. \n");
    //genKML();

    for(var i=0;i<config.tileConfig.tileCountX;i++)
    {
        for(var j=0;j<config.tileConfig.tileCountY; j++)
        {
            loadTileKMLFile("./Tiles/"+i+"/"+j+"/Layer_absolute_Tile_"+i+"_"+j+"_collada.kml",client, i, j);
        }
    }

    //loadTileKMLFile("./Tiles/"+3+"/"+3+"/Layer_absolute_Tile_"+3+"_"+3+"_collada.kml",client, 3, 3);

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

    var parser = new xmldom.DOMParser();
    var XMLS = new xmldom.XMLSerializer();
    var doc = parser.parseFromString(basicStructureXML, "application/xml");
    //console.log(XMLS.serializeToString(doc));

    var KMLDocument = doc.getElementsByTagName("Document")[0];

    //console.log(XMLS.serializeToString(doc));

    for(var i=0; i<config.tileConfig.tileCountX; i++){
        for(var j=0; j<config.tileConfig.tileCountY; j++){
            // TODO: 构造Folder tile_i_j，插入文档树
            var FolderObj = {
                name: "Layer_absolute_Tile_" + i + "_" + j,
                south:config.tileConfig.boundary.south + config.tileConfig.tileHeight*i,
                north:config.tileConfig.boundary.south + config.tileConfig.tileHeight*(i+1),
                west:config.tileConfig.boundary.west + config.tileConfig.tileWidth*j,
                east:config.tileConfig.boundary.west + config.tileConfig.tileWidth*(j+1),
                href:"Tiles/"+i+"/"+j+"/"+"Layer_absolute_Tile_"+i+"_"+j+"_"+"collada.kml"
            }
            var Folder = doc.createElement("Folder");
            var Folder_name = doc.createElement("name");
            var Folder_name_textNode = doc.createTextNode(FolderObj.name);
            Folder_name.appendChild(Folder_name_textNode);

            var Folder_NetworkLink = doc.createElement("NetworkLink");
            var NetworkLink_name = doc.createElement("name");
            var NetworkLink_name_text = doc.createTextNode("Display as collada");
            NetworkLink_name.appendChild(NetworkLink_name_text);
            //Folder_NetworkLink.appendChild(NetworkLink_name_text);

            var Region = doc.createElement("Region");

            var LatLonAltBox = doc.createElement("LatLonAltBox");
            var northNode = doc.createElement("north");
            var southNode = doc.createElement("south");
            var eastNode = doc.createElement("east");
            var westNode = doc.createElement("west");
            northNode.appendChild( doc.createTextNode(""+FolderObj.north) );
            southNode.appendChild( doc.createTextNode(""+FolderObj.south) );
            eastNode.appendChild( doc.createTextNode(""+FolderObj.east) );
            westNode.appendChild( doc.createTextNode(""+FolderObj.west) );
            LatLonAltBox.appendChild( doc.createTextNode("\n") );
            LatLonAltBox.appendChild(northNode);
            LatLonAltBox.appendChild( doc.createTextNode("\n") );
            LatLonAltBox.appendChild(southNode);
            LatLonAltBox.appendChild( doc.createTextNode("\n") );
            LatLonAltBox.appendChild(eastNode);
            LatLonAltBox.appendChild( doc.createTextNode("\n") );
            LatLonAltBox.appendChild(westNode);
            LatLonAltBox.appendChild( doc.createTextNode("\n") );

            Region.appendChild( doc.createTextNode("\n") );
            Region.appendChild(LatLonAltBox);
            Region.appendChild( doc.createTextNode("\n") );

            var Link = doc.createElement("Link");
            var Link_href = doc.createElement("href");
            Link_href.appendChild( doc.createTextNode(FolderObj.href) );
            var Link_viewRefreshMode = doc.createElement("viewRefreshMode");
            Link_viewRefreshMode.appendChild( doc.createTextNode("onRegion") );
            var Link_viewFormat = doc.createElement("viewFormat");
            Link.appendChild( doc.createTextNode("\n") );
            Link.appendChild(Link_href);
            Link.appendChild( doc.createTextNode("\n") );
            Link.appendChild(Link_viewRefreshMode);
            Link.appendChild( doc.createTextNode("\n") );
            Link.appendChild(Link_viewFormat);
            Link.appendChild( doc.createTextNode("\n") );

            Folder_NetworkLink.appendChild( doc.createTextNode("\n") );
            Folder_NetworkLink.appendChild(NetworkLink_name);
            Folder_NetworkLink.appendChild( doc.createTextNode("\n") );
            Folder_NetworkLink.appendChild(Region);
            Folder_NetworkLink.appendChild( doc.createTextNode("\n") );
            Folder_NetworkLink.appendChild(Link);
            Folder_NetworkLink.appendChild( doc.createTextNode("\n") );

            Folder.appendChild( doc.createTextNode("\n") );
            Folder.appendChild(Folder_name);
            Folder.appendChild( doc.createTextNode("\n") );
            Folder.appendChild(Folder_NetworkLink);
            Folder.appendChild( doc.createTextNode("\n") );

            KMLDocument.appendChild(Folder);
            KMLDocument.appendChild( doc.createTextNode("\n") );
        }
    }

    fs.writeFile("./tmp/test.xml",XMLS.serializeToString(doc),"utf8", function(error){
        if(error){
            console.log(error);
        }
    })

    return XMLS.serializeToString(doc);
}

function loadTileKMLFile(filename, client, x, y)
{
    fs.readFile(filename, "utf8", function(error,data){
        if(error){
            console.log("read tile kml file failed:"+ filename);

            return;
        }
        else{
            var parser = new xmldom.DOMParser();
            var XMLS = new xmldom.XMLSerializer();
            var doc = parser.parseFromString(data, "application/xml");
            //console.log(XMLS.serializeToString(doc));

            // 选择Location节点
            var PlaceMarksList = doc.getElementsByTagName("kml:Placemark");
            var length = PlaceMarksList.length;
            if(length <= 1)
            {
                console.log("empty tile " + x + "," + y);
                return;
            }

            for(var i=1; i<length; i++){
                var place = PlaceMarksList[i];

                var id = place.getAttribute("id");

                var name = place.getElementsByTagName("kml:name")[0].childNodes[0].nodeValue;
                var longitude = parseFloat( place.getElementsByTagName("kml:longitude")[0].childNodes[0].nodeValue );
                var latitude = parseFloat( place.getElementsByTagName("kml:latitude")[0].childNodes[0].nodeValue );
                var altitude = parseFloat( place.getElementsByTagName("kml:altitude")[0].childNodes[0].nodeValue );
                var heading = parseFloat( place.getElementsByTagName("kml:heading")[0].childNodes[0].nodeValue );
                var href = place.getElementsByTagName("kml:href")[0].childNodes[0].nodeValue;

                InsertBuildingInfo(id, name, longitude, latitude, altitude, heading, href, x, y);
            }


        }
    })


    function InsertBuildingInfo(id, name, longitude, latitude, altitude, heading, href, x, y)
    {
        var sqlString = "insert into BuildingInfo values('"
            + id + "','" + name + "'," + longitude + "," + latitude + "," + altitude + "," + heading + ",'"
            + href + "'," + x + "," + y + ")";
        console.log(sqlString);
        client.query(sqlString, function(error, results){
            if(error){
                console.log("select error:"+error.message + "//" + sqlString);
                client.end();
                return;
            }

        })
    }
}

exports.genKML = genKML;