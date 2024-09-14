import { ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { MongoClient } from "mongodb";
import Logging from "../../../Modules/Logging"
var config = require("../../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcomer-message')
        .setDescription('👋 Updates the welcomer message.')
        .addStringOption(option => option.setName('type').setDescription('The type of message to set.').setRequired(true).addChoices(
            {name: "Join", value: "join"},
            {name: "Leave", value: "leave"}
        ))
        .addStringOption(option => option.setName('message').setDescription('The message to set as the welcomer message.').setRequired(true))
        .setDMPermission(false),
    permission: PermissionsBitField.Flags.ManageChannels,

    async execute(int:ChatInputCommandInteraction) {
        try{
            await int.deferReply();
            var type = int.options.getString("type");
            var message = int.options.getString("message");

            var mc = new MongoClient(config.mongo.url);
            await mc.connect();
            var db = mc.db(config.mongo.dbName);
            var guilds = db.collection("Guilds");

            // Insert the amount into guild, create guild if it doesn't exist
            await guilds.updateOne({_id: int.guildId as any}, {$set: {[`welcomer.${type}Message`]: message}}, {upsert: true});
            await int.followUp(`✅ Updated the welcomer ${type} message to \`${message}\`.`);

            await mc.close();
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}