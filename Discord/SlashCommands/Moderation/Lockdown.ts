import { ChatInputCommandInteraction, EmbedBuilder, ChannelType, PermissionFlags, PermissionsBitField, Role, SlashCommandBuilder, TextChannel, User } from "discord.js";
import Logging from "../../../Modules/Logging";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lockdown")
        .setDescription("🔒 Locks down the specified channel")
        .addChannelOption(option => option.setName("channel").setDescription("The channel to lock down").setRequired(true).addChannelTypes(ChannelType.GuildText))
        .addStringOption(option => option.setName("reason").setDescription("The reason for locking down the channel"))
        .setDMPermission(false),
    permission: PermissionsBitField.Flags.ManageChannels,
    
    async execute(int:ChatInputCommandInteraction) {
        try{
            var channel = int.options.getChannel("channel") as TextChannel;
            var reason:string = int.options.getString("reason") || "No reason provided";

            var everyone:Role = int.guild?.roles.everyone as Role;

            // Channel is not locked down, lock it down
            if(channel.permissionsFor(everyone)?.has(PermissionsBitField.Flags.SendMessages))
            {
                channel.permissionOverwrites.edit(everyone, {SendMessages: false});
                await int.reply({content: `Successfully locked down ${channel.name}!`});

                var LockMessage = new EmbedBuilder()
                .setTitle(`🔒 Channel locked down`)
                .setDescription(`${reason}`)
                .setColor("#ff6c4f")
                .setTimestamp(new Date())
                .setFooter({iconURL: int.user.displayAvatarURL(), text: int.user.tag})
                await channel.send({embeds: [LockMessage]});
            }
            else // Channel is locked down, unlock it
            {
                channel.permissionOverwrites.edit(everyone, {SendMessages: true});
                await int.reply({content: `Successfully unlocked ${channel.name}!`});

                var UnlockMessage = new EmbedBuilder()
                .setTitle(`🔓 Channel unlocked`)
                .setDescription(`${reason}`)
                .setColor("#4fff8a")
                .setTimestamp(new Date())
                .setFooter({iconURL: int.user.displayAvatarURL(), text: int.user.tag})
                await channel.send({embeds: [UnlockMessage]});
            }
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}