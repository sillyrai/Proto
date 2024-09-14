import { ChannelType, ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { MongoClient } from "mongodb";
import Logging from "../../../Modules/Logging";
var config = require("../../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('starboard-channel')
        .setDescription('⭐ Updates the starboard channel.')
        .addChannelOption(option => option.setName('channel').setDescription('The channel to set as the starboard channel.').setRequired(true).addChannelTypes(ChannelType.GuildText))
        .setDMPermission(false),
    permission: PermissionsBitField.Flags.ManageChannels,
    async execute(int:ChatInputCommandInteraction) {
        try{
            await int.deferReply();
            var channel = int.options.getChannel("channel") as TextChannel;

            var mc = new MongoClient(config.mongo.url);
            await mc.connect();
            var db = mc.db(config.mongo.dbName);
            var guilds = db.collection("Guilds");

            // Insert the amount into guild, create guild if it doesn't exist
            await guilds.updateOne({_id: int.guildId as any}, {$set: {"starboard.channel": channel.id}}, {upsert: true});
            await int.followUp(`✅ Updated the starboard channel to <#${channel.id}>.`);

            await mc.close();
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}