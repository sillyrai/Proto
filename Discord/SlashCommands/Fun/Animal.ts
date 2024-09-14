import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, Events, Interaction, SlashCommandBuilder } from "discord.js";
import axios from "axios";
import Logging from "../../../Modules/Logging";

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("animal")
        .setDescription("🐱 Get a random animal from the selected type")
        .addStringOption(option => option.setName("type").setDescription("The type of animal you want to get").setRequired(true)
            .addChoices(
                {name:"🦊 Fox", value:"fox"},
                {name:"🐶 Dog", value:"dog"},
                {name:"🐍 Snek", value:"snek"},
                {name:"🐱 Snep", value:"snep"},
                {name:"🐼 Wah", value:"wah"}
            )),

    async execute(int:ChatInputCommandInteraction) {
        try{
            var animal = int.options.getString("type") as string;
            var title:string = "N/A"
            switch(animal)
            {
                case "fox":
                    title = "🦊 Foxes!"
                    break;
                case "dog":
                    title = "🐶 Dogs!"
                    break;
                case "snek":
                    title = "🐍 Sneks!"
                    break;
                case "snep":
                    title = "🐱 Sneps!"
                    break;
                case "wah":
                    title = "🐼 Wahs!"
                    break;
            }
            await int.deferReply()
            axios.get(`https://api.tinyfox.dev/img.json?animal=${animal}`).then(async (res) => {
                var Embed = new EmbedBuilder();
                Embed.setColor("#2C2D30")
                var url = `https://api.tinyfox.dev${res.data.loc}`.toString();
                Embed.setImage(url)
                Embed.setTitle(title)

                var row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("animal:next")
                        .setLabel("Next")
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji("➡️"),
                    new ButtonBuilder()
                        .setCustomId("delete")
                        .setLabel("Delete")
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setLabel("Open in browser")
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://api.tinyfox.dev${res.data.loc}`)
                )
                await int.followUp({embeds: [Embed], components:[row]})
            })

            var msg = await int.fetchReply()
            async function nextImage(int:Interaction)
            {
                if(int.isButton() && msg.id ==  int.message.id)
                {
                    axios.get(`https://api.tinyfox.dev/img.json?animal=${animal}`).then(async (res) => {
                        var Embed = new EmbedBuilder();
                        Embed.setColor("#2C2D30")
                        Embed.setImage(`https://api.tinyfox.dev${res.data.loc}`)
                        Embed.setTitle(title)

                        var row = new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("animal:next")
                                    .setLabel("Next")
                                    .setStyle(ButtonStyle.Primary)
                                    .setEmoji("➡️"),
                                new ButtonBuilder()
                                    .setCustomId("delete")
                                    .setLabel("Delete")
                                    .setStyle(ButtonStyle.Danger),
                                new ButtonBuilder()
                                    .setLabel("Open in browser")
                                    .setStyle(ButtonStyle.Link)
                                    .setURL(`https://api.tinyfox.dev${res.data.loc}`)
                            )
            
                        await int.update({embeds: [Embed], components:[row]})
                    })
                }
            }
            var btnListener = int.client.on(Events.InteractionCreate, nextImage)
            await delay(3*60*1000)
            btnListener.removeListener(Events.InteractionCreate, nextImage)
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}