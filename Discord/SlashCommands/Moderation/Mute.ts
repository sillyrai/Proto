import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionsBitField, Role, SlashCommandBuilder, TextChannel, User } from "discord.js";
import Logging from "../../../Modules/Logging";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("🔇 Mutes the specified user")
        .addUserOption(option => option.setName("user").setDescription("The user to mute").setRequired(true))
        .addNumberOption(option => option.setName("duration").setDescription("The duration of the mute").setRequired(true))
        .addStringOption(option=>
            option.setName("type")
            .setDescription("The reason for muting the user")
            .setRequired(true)
            .addChoices(
                {name: "Minutes", value: "minutes"},
                {name: "Hours", value: "hours"},
                {name: "Days", value: "days"},
                {name: "Weeks", value: "weeks"},
            ))
        .setDMPermission(false),
    permission: PermissionsBitField.Flags.ModerateMembers,
    
    async execute(int:ChatInputCommandInteraction) {
        try{
            var user = int.options.getUser("user") as User;
            var reason:string = int.options.getString("reason") || "No reason provided";
            var duration:number = int.options.getNumber("duration") as number;
            var type:string = int.options.getString("type") as string

            var member:GuildMember = int.guild?.members.resolve(user) as GuildMember;

            if(!member.moderatable)
            {
                await int.reply({content: `I can't mute that user! They're probably higher than me in the role hierarchy.`});
                return;
            }

            var seconds = duration;
            switch(type)
            {
                case "minutes":
                    seconds *= 60;
                    break;
                case "hours":
                    seconds *= 60 * 60;
                    break;
                case "days":
                    seconds *= 60 * 60 * 24;
                    break;
                case "weeks":
                    seconds *= 60 * 60 * 24 * 7;
                    break;
            }
            // Range check, cant be <0 seconds or >27 days
            if(seconds < 1 || seconds > 60 * 60 * 24 * 27)
            {
                await int.reply({content: `Invalid duration! Must be between 1 second and 27 days.`});
                return;
            }

            // *1000 because timeout takes milliseconds
            member.timeout(seconds*1000, reason);

            // Try to DM the user
            var couldDm = true;
            try {
                var MuteMsg = new EmbedBuilder()
                .setTitle(`You were muted in ${int.guild?.name}`)
                .setDescription(`Reason: ${reason}\nExpires: <t:${Math.floor((Date.now() + seconds*1000)/1000)}:R>`)
                .setColor("#ff6c4f")
                .setTimestamp(new Date())
                .setFooter({iconURL: int.user.displayAvatarURL(), text: int.user.tag})
                await user.send({embeds: [MuteMsg]});
            }
            catch (e) {couldDm = false;}

            // Send a message in the channel
            if(couldDm)
                await int.reply({content: `Successfully muted ${user.tag} for ${duration} ${type}!`});
            else
                await int.reply({content: `Successfully muted ${user.tag} for ${duration} ${type}! (Couldn"t DM user)`});
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}