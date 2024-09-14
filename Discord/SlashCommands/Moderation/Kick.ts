import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionsBitField, SlashCommandBuilder, User } from "discord.js";
import Logging from "../../../Modules/Logging";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("🔨 Kicks a person from the server")
        .addUserOption(option => option.setName("user").setDescription("The user to kick").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The reason for kicking the user"))
        .setDMPermission(false),
    permission: PermissionsBitField.Flags.KickMembers,
    
    async execute(int:ChatInputCommandInteraction) {
        try{
            var user:User = int.options.getUser("user") as User;
            var member:GuildMember = int.guild?.members.resolve(user) as GuildMember;
            var reason:string = int.options.getString("reason") || "No reason provided";

            if(!member.kickable)
            {
                await int.reply({content: `I can't kick that user! They're probably higher than me in the role hierarchy.`});
                return;
            }

            var couldDm = true;
            try {
                var KickMsg = new EmbedBuilder()
                .setTitle(`You were kicked from ${int.guild?.name}`)
                .setDescription(`Reason: ${reason}`)
                .setColor("#2C2D30")
                .setTimestamp(new Date())
                .setFooter({iconURL: int.user.displayAvatarURL(), text: int.user.tag})
                await user.send({embeds: [KickMsg]});
            }
            catch (e) {couldDm = false;}

            await member.kick(reason);

            if(couldDm)
                await int.reply({content: `Successfully kicked ${user.tag}!`});
            else
                await int.reply({content: `Successfully kicked ${user.tag}! (Couldn't DM user)`});
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}