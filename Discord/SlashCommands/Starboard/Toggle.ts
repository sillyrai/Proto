import { ChannelType, ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { MongoClient } from "mongodb";
import Logging from "../../../Modules/Logging";
var config = require("../../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('starboard-enabled')
        .setDescription('⭐ Toggles the starboard on or off.')
        .addBooleanOption(option => option.setName('enabled').setDescription('Whether to enable or disable the starboard.').setRequired(true))
        .setDMPermission(false),
    permission: PermissionsBitField.Flags.ManageChannels,
    async execute(int:ChatInputCommandInteraction) {
        try{
            await int.deferReply();
            var enabled = int.options.getBoolean("enabled");

            var mc = new MongoClient(config.mongo.url);
            await mc.connect();
            var db = mc.db(config.mongo.dbName);
            var guilds = db.collection("Guilds");

            // Insert the amount into guild, create guild if it doesn't exist
            await guilds.updateOne({_id: int.guildId as any}, {$set: {"starboard.enabled": enabled}}, {upsert: true});
            await int.followUp(`✅ Starboard ${enabled?"enabled":"disabled"}.`);

            await mc.close();
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}