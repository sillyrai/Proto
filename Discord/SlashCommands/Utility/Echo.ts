import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Logging from "../../../Modules/Logging";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("echo")
        .setDescription("🔊 echoes your message")
        .addStringOption(option => option.setName("message").setDescription("The message to echo").setRequired(true)),

    async execute(int:ChatInputCommandInteraction) {
        try{
            var msg = int.options.getString("message") as string;
            await int.reply({content: msg})
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}