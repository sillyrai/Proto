import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, User } from "discord.js";
import Logging from "../../../Modules/Logging"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lookup")
        .setDescription("🔍 Looks up a users information")
        .addUserOption(option => option.setName("user").setDescription("The user to lookup").setRequired(true))
        .setDMPermission(false),

    async execute(int:ChatInputCommandInteraction) {
        try{
            var user = int.options.getUser("user") as User;
            var member = int.guild?.members.cache.get(user.id);

            var Info = new EmbedBuilder()
                .setTitle(`🔍 ${user.tag}`)
                .setThumbnail(user.displayAvatarURL({size: 512}))
                .addFields(
                    {name:"Username", value: user.username, inline: true},
                    {name:"Discriminator", value: user.discriminator, inline: true},
                    {name:"ID", value: user.id, inline: true},
                    {name:"Bot", value: user.bot ? "Yes" : "No", inline: true},
                    {name:"Created At", value: `<t:${Math.floor(user.createdTimestamp/1000)}:R>`, inline: true},
                    {name:"Joined At", value: member ? `<t:${Math.floor(member.joinedTimestamp!/1000)}:R>` : "Not in server", inline: true},
                    {name:"Roles", value: member ? member.roles.cache.map(role => role.toString()).join(", ") : "Not in server", inline: true},
                )
                .setColor(member?.displayColor||"#2C2D30")
                .setAuthor({name: int.user.username, iconURL: int.user.displayAvatarURL({size:64})})
                .setTimestamp(Date.now())
            
            await int.reply({embeds: [Info]});
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}