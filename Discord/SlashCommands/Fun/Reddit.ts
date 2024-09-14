import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, Events, SlashCommandBuilder, TextChannel } from "discord.js";
import rAPI from "../../../Modules/rAPI";
import Logging from "../../../Modules/Logging";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reddit")
        .setDescription("🐸 Lookup Reddit posts")
        .addStringOption(option => option.setName("subreddit").setDescription("The subreddit to lookup").setRequired(true)),

    async execute(int:ChatInputCommandInteraction) {
        try{
            await int.deferReply()
            var subreddit =  int.options.getString("subreddit") as string;
            subreddit = subreddit.replace(/r\//g, "");

            var post:any = await rAPI.getRandomRedditPost(subreddit)
            if(post == null)
            {
                var err = new EmbedBuilder()
                err.setTitle(":warning: Invalid Subreddit")
                err.setDescription(`The subreddit you provided is invalid.`)
                err.setColor("#FECB4D")
                err.setTimestamp(new Date())

                await int.editReply({embeds: [err]})
                return;
            }

            var curChannel = int.channel as TextChannel;
            if(post.over_18 && !curChannel.nsfw)
            {
                var err = new EmbedBuilder()
                err.setTitle(":warning: NSFW Content")
                err.setDescription(`The subreddit you provided contains (or atleast responded with) NSFW content. Please use this command in a NSFW channel.`)
                err.setColor("#FECB4D")
                err.setTimestamp(new Date())
                err.setImage("https://cdn.discordapp.com/attachments/778251561356754944/1103740016443801690/image.png")

                await int.editReply({embeds: [err]})
                return;
            }
            var embd = new EmbedBuilder()
                .setTitle(post.title)
                .setURL(`https://reddit.com${post.permalink}`)
                .setDescription(post.selftext||" ")
                .setAuthor({name: post.author})
                .setFooter({text:`👍 ${post.ups} | 💬 ${post.num_comments}`})
                .setTimestamp(new Date(post.created_utc * 1000))
                .setColor("#FF4500")
                .setImage(post.url)
            
            var row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Open in Browser")
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://reddit.com${post.permalink}`)
                )

            await int.followUp({embeds: [embd], components:[row]})
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}