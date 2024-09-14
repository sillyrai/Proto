import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder, User } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("ℹ️ Displays the info page about the bot"),

    async execute(int:ChatInputCommandInteraction) {
        var rai = int.client.users.cache.get("285092930400813056") as User
        var embd = new EmbedBuilder()
        embd.setTitle("Proto")
        embd.setFooter({text:"For furries by furries"})
        embd.setTimestamp(new Date())
        embd.setAuthor({iconURL:rai.displayAvatarURL(), name:`Made by: ${rai.tag}`})
        embd.setColor(Colors.Blurple)

        embd.addFields({name:"📑 Commands",value:"All of the available commands can be viewed by pressing `/`"})
        embd.addFields({name:"🏓 Ping",value: `${Math.abs(Date.now() - int.createdTimestamp)}ms`, inline:true})
        embd.addFields({name:"📊 Uptime",value: `since: <t:${Math.floor(int.client.readyTimestamp/1000)}:R>`, inline:true})
        embd.addFields({name:"💎 Shards",value: `${int.client.options.shardCount}`, inline:true})
        embd.addFields({name:"📚 Support Guild",value: `If you need some kind of support with the bot or want to make a suggestion/report, feel free to join the [support guild](https://discord.gg/bDpVRKk7TW)`, inline:false})

        embd.setThumbnail(int.client.user.displayAvatarURL())

        var row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Invite the bot")
                    .setURL("https://discord.com/api/oauth2/authorize?client_id=724601984241369100&permissions=8&scope=bot%20applications.commands")
                    .setEmoji("📨"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Support Server")
                    .setURL("https://discord.gg/bDpVRKk7TW")
                    .setEmoji("📚"),
            )

        await int.reply({embeds: [embd], components: [row]})

    }
}