import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, User } from "discord.js";
import Logging from "../../../Modules/Logging";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("furryrate")
        .setDescription("🦊 Rates how much of a furry the given person is. Value changes each hour")
        .addUserOption(option => option.setName("user").setDescription("The user to rate").setRequired(true)),
    
    async execute(int:ChatInputCommandInteraction) {
        try{
            var user = int.options.getUser("user") as User;

            var seed = 0;
            for (var i = 0; i < user.username.length; i++)
                seed += user.username.charCodeAt(i);
            seed += new Date().getHours(); // change every day
            var random = seed % 111; // 0-110

            var embd = new EmbedBuilder();
            embd.setTitle(`:fox: Furry Rate`)
                .setDescription(`${user.username} is ${random}% furry!`)
                .setColor("#EC8C25")
                .setAuthor({name: int.user.username, iconURL: int.user.displayAvatarURL({size:64})})
                .setTimestamp(Date.now())

            await int.reply({embeds: [embd]});
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}