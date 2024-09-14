import {MongoClient, ObjectId} from "mongodb";
import {Client, Events} from "discord.js"

var config = require("../config.json");
var c = new Client({intents: ["Guilds", "GuildMembers"]});

(async()=>{
    var mc = new MongoClient(config.mongo.url);
    await mc.connect();
    var db = mc.db(config.mongo.dbName);
    var guilds = db.collection("Guilds");

    c.on(Events.ClientReady, async (c:Client) => {
        c.guilds.cache.forEach(async (g) => {
            var doc = {
                _id: g.id as any,
                starboard:{
                    enabled: false,
                    symbol: "⭐",
                    required: 5,
                    channel: null,
                    messages: [] // ID's of messages that are on the starboard
                },
                welcomer:{
                    enabled: false,
                    channel: null,
                    joinMessage: "Welcome to the server, {user}!",
                    leaveMessage: "Goodbye, {user}!",
                },
                blacklist:{
                    blacklisted: false,
                    reason: "No reason specified"
                }
            }
            await guilds.insertOne(doc);
            console.log(`Inserted ${g.name} into the database.`)
        })
    })

    c.login(config.discord.token);
})()