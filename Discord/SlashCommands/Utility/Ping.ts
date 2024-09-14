import { ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import Logging from "../../../Modules/Logging"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("🏓 Pings the bot"),
    //permission: PermissionsBitField.Flags.Administrator, // This is the default permission, so it"s not required

    async execute(int:ChatInputCommandInteraction) {
        try{
            await int.reply({content: `🏓 Pong! Latency: ${Math.abs(Date.now() - int.createdTimestamp)}ms.`})
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}