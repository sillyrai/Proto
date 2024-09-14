import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Logging from "../../../Modules/Logging";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uwuify')
        .setDescription('🐱 UwUify your message')
        .addStringOption(option => option.setName('message').setDescription('The message to UwUify').setRequired(true)),
    
    async execute(int:ChatInputCommandInteraction) {
        try{
            var msg = int.options.getString('message') as string;
            //msg = msg.toLowerCase();
            msg = msg.replace(/(?:l|r)/g, 'w').replace(/(?:L|R)/g, 'W').replace(/n([aeiou])/g, 'ny$1').replace(/N([aeiou])/g, 'Ny$1').replace(/N([AEIOU])/g, 'NY$1').replace(/ove/g, 'uv').replace(/OVE/g, 'UV') // thanks copilot for whatever this is
            msg = `${msg[0]}-${msg}~`
            await int.reply({content: msg})
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}