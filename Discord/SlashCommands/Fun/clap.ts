import { ChatInputCommandInteraction, SlashCommandBuilder, User } from "discord.js";
import Logging from "../../../Modules/Logging";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clap")
        .setDescription("Replaces 👏 every 👏 space 👏 with 👏 a 👏 clapping 👏 emoji")
        .addStringOption(option => option.setName("text").setDescription("The text to clapify").setRequired(true)),

    async execute(int:ChatInputCommandInteraction) {
        try{
            var text:string = int.options.getString("text") as string;
            var clapified = text.replace(/ /g, " 👏 ");
            await int.reply({content: clapified});
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}