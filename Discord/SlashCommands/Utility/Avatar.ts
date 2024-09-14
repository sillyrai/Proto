import {ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, ImageSize, SlashCommandBuilder } from "discord.js";
import Logging from "../../../Modules/Logging"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("🖼️ Gets the avatar of a user")
        .addUserOption((option) => option.setName("user").setDescription("The user to get the avatar of"))
        .addStringOption(opt=>
            opt.setName("size")
            .setDescription("The size of the avatar")
            .addChoices(
                {name: "128x128", value: "128"},
                {name: "256x256", value: "256"},
                {name: "512x512", value: "512"},
                {name: "1024x1024", value: "1024"},
                {name: "2048x2048", value: "2048"},
			)),

    async execute(int:ChatInputCommandInteraction) {
        try{
            var user = int.options.getUser("user") ?? int.user
            var size = int.options.getString("size") ?? "2048"
            var imgUrl = user.displayAvatarURL({size: parseInt(size) as ImageSize})

            var embd = new EmbedBuilder()
            embd.setImage(imgUrl)
            embd.setTitle(`${user.username}'s avatar`)
            embd.setFooter({iconURL: int.user.displayAvatarURL(), text: int.user.username})
            embd.setTimestamp(new Date())
            embd.setColor("#2C2D30")

            var row = new ActionRowBuilder<ButtonBuilder>()
            const openUrl = new ButtonBuilder()
            .setLabel("Open in browser")
            .setStyle(ButtonStyle.Link)
            .setURL(imgUrl);
            row.addComponents(openUrl)

            await int.reply({embeds: [embd], components: [row]})
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}