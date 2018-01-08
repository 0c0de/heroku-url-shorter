const express = require('express');
const database = require('mongoose');

let app = express();
let port = process.env.PORT || 3000;
let databaseURI = process.env.MONGOLAB_URI || process.env.MONGOHR_URL || 'mongodb://localhost/test';

app.get("/", (Request, Response) =>{
    Response.send("Hey this is a hello world text");
});

app.get("/new/:url(*)", (Request, Response) => {
    var uri = encodeURI(Request.params.url);
    database.connect(databaseURI, (err, db) => {
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