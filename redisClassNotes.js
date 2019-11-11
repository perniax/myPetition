// REDIS CLASS

const redis = require("./redis");
let { hash, compare } = require("./utils/bc");
const bc = require("./utils/bc");
const express = require("express");
const app = express();
//***************DEMO ROUTE FOR REDIS******************
// Path:
// /mnt/c/Users/Jesus Pernia/desktop/sassafras-projects/redis-4.0.11

app.get("/redis-fun", (req, res) => {
    // (KEY, time to expiration(in secs), VALUE)
    //* edis returns a string by default, so because we want to get is the Array, we stringify it;
    //** so every time that we want to put an Array or Object WE HAVE TO STRINGIFY IT FIRST!!!**
    redis
        .setex(
            "favoriteAnimals",
            180,
            JSON.stringify(["dog", "panda", "maki", "meercat", "wombats"])
        )
        .then(() => {
            res.redirect("/get-form-redis");
        })
        .catch(err => {
            console.log("error in setex: ", err);
        });
});

app.get("/get-form-redis", (req, res) => {
    //this route will retrieve the list of animals from redis-function
    redis
        .get("favoriteAnimals")
        .then(data => {
            console.log("data from animals:", JSON.parse(data));
            //*** Parse only works for JSON, so we take the return from the first get and parse it in order to check what kind of data are we getting,
            // once parsed, we have a "normal" JS and we can work it out
        })
        .catch(err => {
            console.log("error getting the animals: ", err);
        });
});

//**now we ,ake a new route, to try the delete the animals

app.get("/delete-animals", (req, res) => {
    redis
        .del("favoriteAnimals")
        .then(() => {
            res.redirect("/get-from-redis");
        })
        .catch(err => {
            console.log("err inredis.del: ", err);
        });
});

//
