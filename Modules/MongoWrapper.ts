import {MongoClient} from "mongodb";
import MongoUser from "../Templates/MongoUser";
import MongoGuild from "../Templates/MongoGuild";
var config = require("../config.json")

var Users = {
    get: async function (id: string, key: string) {
        var client = new MongoClient(config.mongo.url)

        await client.connect()
        var db = client.db(config.mongo.dbName)
        var collection = db.collection("Users")

        var user = collection.findOne({_id: id as any})
        client.close()

        return user[key]
    },
}