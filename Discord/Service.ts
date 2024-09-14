// Main File for controlling everything Discord related, everything begins here.

import { ChatInputCommandInteraction, Client, Events, Guild, Interaction } from "discord.js";
import { MongoClient } from "mongodb"
import Logging from "../Modules/Logging";
import ansi from "ansi-colors";
import SlashCommandHandler from "./Handlers/SlashCommandHandler";
import RotatingStatus from "./Handlers/RotatingStatus";
import ButtonListener from "./Handlers/ButtonListener";
import StarboardHandler from "./Handlers/StarboardHandler";
import WelcomerHandler from "./Handlers/WelcomerHandler";

import MongoGuild from "../Templates/MongoGuild";

import fs from "fs"
var config = require("../config.json")

var CommandCache:Map<string, any> = new Map<string, any>();

export default function(c:Client){
    Logging.info(`Attempting to connect to Discord...`);
    RotatingStatus(c);
    ButtonListener(c);
    StarboardHandler(c);
    WelcomerHandler(c);

    Logging.debug(`Caching commands...`)
    fs.readdirSync("./Discord/SlashCommands").forEach((dir) => {
        fs.readdirSync(`./Discord/SlashCommands/${dir}`).forEach(async(file) => {
            if(!file.endsWith(".ts")) return;
    
            var cmd = require(`./SlashCommands/${dir}/${file}`)
            CommandCache.set(cmd.data.name, cmd)
            Logging.debug(`SlashCommandHandler: Loaded command ${cmd.data.name} into registry`)
        })
    })

    c.on(Events.ShardReady, async(shardId:number) => {
        Logging.info(`Shard ${ansi.yellow(shardId.toString())} is ready!`);
    })

    c.on(Events.ClientReady, async() => {
        Logging.ok("Client ready!")
        // Check for missing guilds, add them to the database if they are missing
        /*
        var mc = new MongoClient(config.mongo.url);
        await mc.connect()
        var db = mc.db(config.mongo.dbName);
        var guilds = db.collection("Guilds");

        c.guilds.cache.forEach(async (guild:Guild) => {
            var guildDoc = await guilds.findOne({_id: guild.id as any});
            if(!guildDoc)
            {
                await guilds.insertOne(MongoGuild.createFor(guild.id))
                Logging.info(`Added guild ${guild.name} to database`)
            }
            else
            {
                // Logging.ok(`Guild ${guild.name} is already in database`)
            }
        })
        */
    })
    c.on(Events.InteractionCreate, async (int:Interaction) => {
        if(int.isChatInputCommand())
            SlashCommandHandler(int, CommandCache)
    })

    c.login(config.discord.token)
}