import { ChannelType, ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { MongoClient } from "mongodb";
import Logging from "../../../Modules/Logging";
var config = require("../../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('starboard-symbol')
        .setDescription('⭐ Sets the symbol to use for starboard.')
        .addStringOption(option => option.setName('symbol').setDescription('The symbol to use for starboard.').setRequired(true))
        .setDMPermission(false),
    permission: PermissionsBitField.Flags.ManageChannels,
    async execute(int:ChatInputCommandInteraction) {
        try{
            await int.deferReply();
            var symbol = int.options.getString("symbol") || "";

            var mc = new MongoClient(config.mongo.url);
            await mc.connect();
            var db = mc.db(config.mongo.dbName);
            var guilds = db.collection("Guilds");

            // This is a really bad way to check it and someone could just enter 2 random letters/emojis/numbers and it would work. Though I don't know how to check if it's a valid unicode emoji.
            // Also doesn't support more complicated emojis like flags or skin tones.
            if(symbol.length > 2) {
                await int.followUp(`❌ The symbol must be a valid unicode emoji.`);
                return;
            }

            // Insert the amount into guild, create guild if it doesn't exist
            await guilds.updateOne({_id: int.guildId as any}, {$set: {"starboard.symbol": symbol}}, {upsert: true});
            await int.followUp(`✅ Changed the emoji for starboard to be ${symbol}.`);

            await mc.close();
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}