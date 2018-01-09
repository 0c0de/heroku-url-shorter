const express = require('express');
const database = require('mongodb').MongoClient();

let app = express();
let port = process.env.PORT || 3000;

app.get("/", (Request, Response) =>{
    Response.send("Hey this is a hello world text");
});

app.get("/new/:url(*)", (Request, Response) => {
    var uri = encodeURI(Request.params.url);
    const databaseURI = process.env.MONGOLAB_URI;
    console.log(databaseURI);
    database.connect(databaseURI, function(err, db) {
        if(err){
            console.log("Error connecting to database: ",databaseURI +" ", err);
        }

        if(db){
            console.log("Succesful connection to database: ", databaseURI +" ",db);
        }
    });
    Response.send(uri);
    
});

app.listen(port, (callback) =>{
    console.log("Detecting a new engineer in port: " + port);
});