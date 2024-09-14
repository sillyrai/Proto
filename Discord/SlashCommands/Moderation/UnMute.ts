import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionsBitField, Role, SlashCommandBuilder, TextChannel, User } from "discord.js";
import Logging from "../../../Modules/Logging";
module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("🔇 Unmutes the specified user")
        .addUserOption(option => option.setName("user").setDescription("The user to unmute").setRequired(true))
        .setDMPermission(false),
    permission: PermissionsBitField.Flags.ModerateMembers,
    
    async execute(int:ChatInputCommandInteraction) {
        try{
            var user = int.options.getUser("user") as User;
            var member:GuildMember = int.guild?.members.resolve(user) as GuildMember;

            if(!member.communicationDisabledUntilTimestamp || member.communicationDisabledUntilTimestamp < Date.now())
            {
                await int.reply({content: `That user isn"t muted!`});
                return;
            }

            await member.timeout(null, "Unmuted by " + int.user.tag)
            await int.reply({content: `Unmuted ${user.tag}.`});
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}