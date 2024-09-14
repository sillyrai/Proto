import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Logging from "../../../Modules/Logging";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("🎱 Ask the magic 8ball a question, totally very legit.")
        .addStringOption(option => option.setName("question").setDescription("The question to ask the magic 8ball").setRequired(true)),
    async execute(int:ChatInputCommandInteraction) {
        try{
            var question:string = int.options.getString("question") as string;

            var responses = [
                "Yeah probably",
                "Nope",
                "Maybe",
                "I don't know",
                "Ask again later",
                "What....",
                "I plead the fifth",
                "Dude you don't want to know",
                "I'm not getting paid enough for this",
                "I mean probably, but I could be wrong",
                "Dear God no",
                "See you in 5 minutes",
                "Look behind you...",
                "Your question sucks",
                "How about you go outside for a while and come back later",
                "Let me ask my lawyer before responding to your question",
                "100% true with out a doubt 0 flaws, ever."
            ];

            // get the same one for the same question
            var seed = 0;
            for (var i = 0; i < question.length; i++)
                seed += question.charCodeAt(i);
            var random = seed % responses.length;

            await int.reply({content: `You asked: \`\`${question}\`\`\n🎱 ${responses[random]}`});
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}