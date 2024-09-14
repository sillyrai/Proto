import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, EmbedBuilder, Events, MessageReaction, PartialMessageReaction, PartialUser, TextChannel, User } from "discord.js";
import {MongoClient} from "mongodb"
import Logging from "../../Modules/Logging";
import internal from "stream";

var config = require("../../config.json")

export default async function(c:Client)
{
    Logging.ok("StarboardHandler: Ready")
    c.on(Events.MessageReactionAdd, async (reaction: MessageReaction | PartialMessageReaction, user:  User|PartialUser) => {
        var mc = new MongoClient(config.mongo.url);
        try{
            if(reaction.message.author?.bot) return; // If the message author is a bot, return. Don't allow bot messages to be on the starboard

            //Logging.debug(`Reaction was added`)
            if(!reaction.message.guild) return; // If the emoji is not from a guild, return
            //Logging.debug(`Reaction was within a guild`)

            //Logging.debug(`Attempting to connect to MongoDB...`)
            // Get emoji for starboard for this guild
            
            await mc.connect();
            var db = mc.db(config.mongo.dbName);
            var guilds = db.collection("Guilds");
            //Logging.debug(`Looking for guild: ${reaction.message.guild.id}`)
            var guild = await guilds.findOne({_id: reaction.message.guild.id as any});
            //Logging.debug(`Connected!.`)

            if(!guild) return; // If the guild doesn't exist, return

            // Check if starboard is enabled
            if(!guild.starboard.enabled) return; // If the starboard is not enabled, return
            //Logging.debug(`Starboard is enabled`)

            var emoji = guild.starboard.symbol;
            //Logging.debug(`Retrieved starboard emoji: ${emoji}`)

            if(reaction.emoji.name != emoji) return; // If the emoji is not the starboard emoji, return
            //Logging.debug(`Reaction was the starboard emoji: ${reaction.emoji.name} == ${emoji}`)

            // Get the starboard channel for this guild
            var channel = reaction.message.guild.channels.cache.get(guild.starboard.channel) as TextChannel;
            if(!channel) return; // If the channel doesn't exist, return
            //Logging.debug(`Retrieved starboard channel: ${channel.name}`)

            // Check if message isnt already on starboard (starboard.messages)
            var messages = guild.starboard.messages;
            if(messages.includes(reaction.message.id)) return; // If the message is already on the starboard, return
            //Logging.debug(`Message is not already on starboard`)

            // Check reaction count for current message
            var count = reaction.count || 1000;
            var required = guild.starboard.required;

            if(count < required) return; // If the reaction count is less than the required amount, return
            //Logging.debug(`Reaction count is greater than or equal to required amount`)

            // Send message to starboard
            var desc = ""
            var embd = new EmbedBuilder();
            embd.setAuthor({name: `${emoji} ${reaction.message.author?.tag}`, iconURL: reaction.message.author?.avatarURL()!});
            desc = reaction.message.content || ""
            embd.setTimestamp(reaction.message.createdAt);
            embd.setColor("#FBA932");
            if(reaction.message.attachments.size > 0)
                embd.setImage(reaction.message.attachments.first()!.url);
            reaction.message.attachments.forEach((att) => {
                desc += `\n[📄 ${att.name}](${att.url})`
            })
            embd.setDescription(desc);

            var row = new ActionRowBuilder<ButtonBuilder>();
            var btn = new ButtonBuilder();
            btn.setLabel("Jump to message");
            btn.setStyle(ButtonStyle.Link);
            btn.setURL(reaction.message.url);
            row.addComponents(btn);

            var msg = await channel.send({embeds: [embd], components: [row]});
            await msg.react(emoji);

            // Add message to starboard.messages via $push
            await guilds.updateOne({_id: reaction.message.guild.id as any}, {$push: {"starboard.messages": reaction.message.id}});
            //Logging.debug(`Added message to starboard.messages`)
            Logging.info(`StarboardHandler: Added message to starboard in ${reaction.message.guild.name} (${reaction.message.guild.id})`)
        }
        catch(err){
            Logging.error(err)
            return;
        }
        finally{
            await mc.close();
        }
    })
}