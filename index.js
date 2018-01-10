const express = require('express');
const database = require('mongodb').MongoClient;

let app = express();
let port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get("/", (Request, Response) =>{
    Response.sendFile(__dirname+'/index.html');
});

app.post("/new/:url(*)", (Request, Response) => {
    if(uri != undefined){
        const databaseURI = process.env.MONGOLAB_URI;
        console.log(databaseURI);
        database.connect(databaseURI, function(err, db) {
            if(err){
                console.log("Oops some error occurred while connecting to database: " + err);
            }

            if(db){
                console.log("Succesful connection to database");
                let finalURI = {
                    GENERATED_URI: Request.host + "/" + generateNewURL(uri),
                    ORIGINAL_URI: uri,
                };
                console.log(finalURI);
                db.collection("urls").insertOne(finalURI, function(err, data){
                    if(err)
                        throw err;
                    
                    console.log("Object inserted correctly");
                    Response.send(finalURI);
                });
                db.close();
            }
        });
    }else{
        Response.send("Send some data  before");
    }
    
});

function generateNewURL(uri){
    let dictionary = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    dictionary = dictionary.split("");
    var finalURL = shuffleArr(dictionary).join("");
    return finalURL;
}

function shuffleArr(arr){
    let shufledArr = [];
    var length = 6;
    var i = arr.length - 1, j, temp;
    if ( length === -1 ) return false;
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