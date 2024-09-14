import { ChatInputCommandInteraction, Embed, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Logging from "../../../Modules/Logging"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("welcomer-help")
        .setDescription("👋 Shows a help page for Welcomer commands"),
    
    async execute(int:ChatInputCommandInteraction){
        try{
            var embed = new EmbedBuilder()
            embed.setTitle("👋 Welcomer Help")
            embed.setDescription("Welcomer is a module that allows you to customize your welcome messages and leave messages. You can also set a channel for the bot to send welcome messages to.\n\nThis page is designed to display all the variables that you can use within the message.")

            embed.addFields({
                name: "User Variables",
                value: "{user.name} - Returns the name of the user that joined/left\n{user.id} - Returns the ID of the user that joined/left\n{user.mention} - Mentions the user that joined"
            },
            {   
                name: "Guild Variables",
                value: "{guild.name} - Returns the name of the server\n{guild.membercount} - Returns the member count of the server"   
            },
            {
                name: "Usage Example",
                value: "```/welcomer-message join Welcome {user.mention} to {server.name}! We now have {server.membercount} members!}```\n\nThis will send a message like this:\n```Welcome @User to Server! We now have 100 members!```\n\nYou can also use this in the leave message."
            })

            embed.setColor("#FECB4D")
            embed.setTimestamp(new Date())
            
            await int.reply({embeds: [embed]})
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}