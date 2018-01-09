const express = require('express');
const database = require('mongodb').MongoClient;

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
            console.log("Oops some error occurred while connecting to database: " + err);
        }

        if(db){
            console.log("Succesful connection to database");
            let finalURI = {
                GENERATED_URI: generateNewURL(uri),
                ORIGINAL_URI: uri,
            };
            console.log(finalURI);
        }
    });
    Response.send(uri);
    
});

function generateNewURL(uri){
    let dictionary = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    dictionary = dictionary.split("");
    var finalURL = shuffleArr(dictionary);
    return finalURL;
}

function shuffleArr(arr){
    let shufledArr = [];
    var length = 6;
    var i = arr.length, j, temp;
    if ( length === 0 ) return false;
    while ( length-- ) {
       j = Math.floor( Math.random() * ( i + 1 ) );
       temp = arr[i];
       arr[i] = arr[j]; 
       arr[j] = temp;
       shufledArr.push(temp);
    }
    return shufledArr;
}

app.listen(port, (callback) =>{
    console.log("Detecting a new engineer in port: " + port);
});