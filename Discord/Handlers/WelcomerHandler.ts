import { Client, Events, Guild, GuildMember, PartialGuildMember, TextChannel } from "discord.js";
import { MongoClient } from "mongodb";
import MongoGuild from "../../Templates/MongoGuild";

import Logging from "../../Modules/Logging";
var config = require("../../config.json");

export default function(c:Client){
    Logging.ok("WelcomerHandler: Ready")
    c.on(Events.GuildMemberAdd, async (member:GuildMember) => {
        var mc = new MongoClient(config.mongo.url);
        try{
            // Check if welcomer is enabled & if so send message
            await mc.connect();
            var db = mc.db(config.mongo.dbName);
            var guilds = db.collection("Guilds");

            var guild = await guilds.findOne({_id: member.guild.id as any});
            if(!guild) return;

            if(!guild.welcomer.enabled) return;

            var channel = member.guild.channels.cache.get(guild.welcomer.channel) as TextChannel;
            if(!channel) return;

            var message = guild.welcomer.joinMessage;
            message = message.replace("{user.name}", member.user.tag);
            message = message.replace("{user.id}", member.id);
            message = message.replace("{user.mention}", `<@${member.id}>`);
            message = message.replace("{guild.name}", member.guild.name);
            message = message.replace("{guild.membercount}", member.guild.memberCount.toString()||"0");

            await channel.send(message);
        }
        catch(err){
            Logging.error(err)
            return;
        }
        finally{
            await mc.close();
        }
    })

    c.on(Events.GuildMemberRemove, async (member:GuildMember|PartialGuildMember) => {
        var mc = new MongoClient(config.mongo.url);
        try{
            // Check if welcomer is enabled & if so send message
            await mc.connect();
            var db = mc.db(config.mongo.dbName);
            var guilds = db.collection("Guilds");

            var guild = await guilds.findOne({_id: member.guild.id as any});
            if(!guild) return;

            if(!guild.welcomer.enabled) return;

            var channel = member.guild.channels.cache.get(guild.welcomer.channel) as TextChannel;
            if(!channel) return;

            var message = guild.welcomer.leaveMessage;
            message = message.replace("{user.name}", member.user?.tag||"Unknown User");
            message = message.replace("{user.id}", member.id);
            message = message.replace("{user.mention}", `<@${member.id}>`);
            message = message.replace("{guild.name}", member.guild.name);
            message = message.replace("{guild.membercount}", member.guild.memberCount.toString()||"0");

            await channel.send(message);
        }
        catch(err){
            Logging.error(err)
            return;
        }
        finally{
            await mc.close();
        }
    })

    c.on(Events.GuildCreate, async (guild) => {
        try{
            // Check for missing guilds, add them to the database if they are missing
            var mc = new MongoClient(config.mongo.url);
            await mc.connect()
            var db = mc.db(config.mongo.dbName);
            var guilds = db.collection("Guilds");

            var guildDoc = await guilds.findOne({_id: guild.id as any});
            if(!guildDoc)
            {
                await guilds.insertOne(MongoGuild.createFor(guild.id))
                Logging.info(`Added guild ${guild.name} to database`)
            }

            await mc.close()
        }
        catch(err){
            Logging.error(err)
            return;
        }
    })
}