import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionsBitField, SlashCommandBuilder, User } from "discord.js";
import Logging from "../../../Modules/Logging";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("🔨 Bans a person from the server")
        .addUserOption(option => option.setName("user").setDescription("The user to ban").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The reason for banning the user"))
        .setDMPermission(false),
    permission: PermissionsBitField.Flags.BanMembers,
    
    async execute(int:ChatInputCommandInteraction) {
        try{
            var user:User = int.options.getUser("user") as User;
            var member:GuildMember = int.guild?.members.resolve(user) as GuildMember;
            var reason:string = int.options.getString("reason") || "No reason provided";

            if(!member.bannable)
            {
                await int.reply({content: `I can't ban that user! They're probably higher than me in the role hierarchy.`});
                return;
            }

            var couldDm = true;
            try {
                var BanMsg = new EmbedBuilder()
                .setTitle(`You were banned from ${int.guild?.name}`)
                .setDescription(`Reason: ${reason}`)
                .setColor("#ff6c4f")
                .setTimestamp(new Date())
                .setFooter({iconURL: int.user.displayAvatarURL(), text: int.user.tag})
                await user.send({embeds: [BanMsg]});
            }
            catch (e) {couldDm = false;}

            await member.ban({reason: reason});

            if(couldDm)
                await int.reply({content: `Successfully banned ${user.tag}!`});
            else
                await int.reply({content: `Successfully banned ${user.tag}! (Couldn't DM user)`});
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}