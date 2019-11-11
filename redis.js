redis.js;

//hay que ponerlo en una carpeta que se llame redis en el mismo nivel que index de la petition
// the stuff put here will go to the redis branch

var redis = require("redis");
var client = redis.createClient({
    host: "localhost",
    port: 6379
});

//client is what allow to get data/commands from and into redis
const { promisify } = require("util");

client.on("error", function(err) {
    console.log(err);
});

// 3 arguments, 1. the key, 2. the value, 2. node style callback fn
//the callback expects an err as the first arg
//**OLD WAY:
// client.set("name", "ivanna", (err, data) => {});

// //now let promisify this functions, using the util library, with promisify we modify the command in order to receive promises, on a ".then() form"
// promisify(client.get).bind(client);

//***when we get the "get" from client, the with bind() we rememnber it that is for the client.. redis syntax. and we do the same with the other redis commands, finally we export them, so;
exports.get = promisify(client.get).bind(client);
exports.setex = promisify(client.setext).bind(client);
exports.del = promisify(client.del).bind(client);
