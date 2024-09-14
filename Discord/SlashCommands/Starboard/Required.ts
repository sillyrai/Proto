import { ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { ObjectId, MongoClient } from "mongodb";
import Logging from "../../../Modules/Logging";
var config = require("../../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("starboard-required")
        .setDescription("⭐ Set the required amount of stars to be added to the starboard.")
        .addIntegerOption(option => option.setName("amount").setDescription("The required amount of stars.").setRequired(true).setMinValue(1).setMaxValue(3621))
        .setDMPermission(false),
    permission: PermissionsBitField.Flags.ManageChannels,

    async execute(int:ChatInputCommandInteraction) {
        try{
            await int.deferReply();
            var amount = int.options.getInteger("amount");

            var mc = new MongoClient(config.mongo.url);
            await mc.connect();
            var db = mc.db(config.mongo.dbName);
            var guilds = db.collection("Guilds");

            // Insert the amount into guild, create guild if it doesn't exist
            await guilds.updateOne({_id: int.guildId as any}, {$set: {"starboard.required": amount}}, {upsert: true});
            await int.followUp(`✅ Set the required amount of stars to ${amount}.`);

            await mc.close();
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}