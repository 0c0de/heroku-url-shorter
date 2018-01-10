const express = require('express');
const database = require('mongodb').MongoClient;

let app = express();
let port = process.env.PORT || 3000;
const databaseURI = process.env.MONGOLAB_URI;

app.use(express.static('public'));

app.get("/", (Request, Response) =>{
    Response.sendFile(__dirname+'/index.html');
});

app.post("/new/:url(*)", (Request, Response) => {
    if(Request.params.url != undefined){
        console.log(databaseURI);
        database.connect(databaseURI, (err, db) => {
            if(err){
                console.log("Oops some error occurred while connecting to database: " + err);
            }

            if(db){
                console.log("Succesful connection to database");
                let finalURI = {
                    GENERATED_URI: Request.host + "/" + generateNewURL(Request.params.url),
                    ORIGINAL_URI: Request.params.url,
                };
                db.collection("urls").findOne(finalURI,(err, db) =>{
                    if(db == null){
                        db.collection("urls").insertOne(finalURI, (err, data) =>{
                            if(err)
                                throw err;
                            
                            console.log("Object inserted correctly");
                            Response.send(finalURI);
                        });
                    }else{
                        finalURI = {
                            GENERATED_URI: Request.host + "/" + generateNewURL(Request.params.url),
                            ORIGINAL_URI: Request.params.url,
                        };

                        db.collection("urls").insertOne(finalURI, (err, data) =>{
                            if(err)
                                throw err;
                            
                            console.log("Object inserted correctly");
                            Response.send(finalURI);
                        });
                    }
                });
                console.log(finalURI);
               
                db.close();
            }
        });
    }else{
        Response.send("Send some data  before");
    }
    
});

app.get("/:codedURL", (Request, Response) =>{
    let urlForSearch = {
        url: window.location + encodeURI(Request.params.codeURL),
    };
    database.connect(databaseURI, (err, db) => {
        if(err){
            console.log("Some error has occurred, ", err);
        }

        db.collection("urls").findOne(urlForSearch, (err, resources) => {
            Response.send('<script>window.location.href = resources.ORIGINAL_URI;<script>');
        });
    });
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