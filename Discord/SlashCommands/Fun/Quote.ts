import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from "discord.js";
import IncorrectQuotes from "../../../Modules/IncorrectQuotes";
import Logging from "../../../Modules/Logging";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quote")
        .setDescription("📜 Creates an incorrect quote with the given people")
        .addStringOption(option => option.setName("person1").setDescription("The first person in the quote").setRequired(true))
        .addStringOption(option => option.setName("person2").setDescription("The second person in the quote").setRequired(false))
        .addStringOption(option => option.setName("person3").setDescription("The third person in the quote").setRequired(false))
        .addStringOption(option => option.setName("person4").setDescription("The fourth person in the quote").setRequired(false))
        .addStringOption(option => option.setName("person5").setDescription("The fifth person in the quote").setRequired(false))
        .addStringOption(option => option.setName("person6").setDescription("The sixth person in the quote").setRequired(false)),

    async execute(int:ChatInputCommandInteraction) {
        try{
            var p1 = int.options.getString("person1") ?? null
            var p2 = int.options.getString("person2") ?? null
            var p3 = int.options.getString("person3") ?? null
            var p4 = int.options.getString("person4") ?? null
            var p5 = int.options.getString("person5") ?? null
            var p6 = int.options.getString("person6") ?? null

            var quote = IncorrectQuotes.generate(p1, p2, p3, p4, p5, p6)
            var member = int.member as GuildMember
            var embed = new EmbedBuilder()
            embed.setTitle(":speech_balloon: Incorrect Quote")
            embed.setDescription(quote!)
            embed.setColor(member.displayColor || "#FECB4D")

            await int.reply({embeds: [embed]})
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}