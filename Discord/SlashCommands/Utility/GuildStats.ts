import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from "discord.js";
import Logging from "../../../Modules/Logging"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("guildstats")
        .setDescription("🖥️ Get stats about the guild")
        .setDMPermission(false),

    async execute(int:ChatInputCommandInteraction) {
        try{
            var callerAsMember = int.member as GuildMember

            var embd = new EmbedBuilder()
            embd.setTitle(":computer: Guild Stats")
            embd.setAuthor({name: int.guild?.name??"Unnamed", iconURL: int.guild?.iconURL()??""})
            embd.setThumbnail(int.guild?.iconURL()??"")
            embd.setColor(callerAsMember.displayHexColor)
            embd.addFields(
                {name: "Members", value: int.guild?.memberCount?.toString()??"UNKNOWN", inline: true},
                {name: "Channels", value: int.guild?.channels.cache.size?.toString()??"UNKNOWN", inline: true},
                {name: "Roles", value: int.guild?.roles.cache.size?.toString()??"UNKNOWN", inline: true},
                {name: "Emojis", value: int.guild?.emojis.cache.size?.toString()??"UNKNOWN", inline: true},
                {name: "Boosts", value: int.guild?.premiumSubscriptionCount?.toString()??"UNKNOWN", inline: true},
                {name: "Owner", value:`<@${int.guild?.ownerId}>`, inline: true},
                {name: "Created", value: `<t:${Math.floor(int.guild?.createdTimestamp!/1000)}:R>`, inline: true},
            )

            await int.reply({embeds: [embd]})
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}