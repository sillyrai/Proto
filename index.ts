import {Client, GatewayIntentBits, MessageMentionTypes} from "discord.js"
import DiscordService from "./Discord/Service";
import Logging from "./Modules/Logging";

const client = new Client({intents: [
    GatewayIntentBits.Guilds, // General use; allows the bot to function
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent, // Allows the bot to read messages, required for Starboard
    GatewayIntentBits.GuildMessageReactions, // Allows the bot to read reactions, required for Starboard
],
allowedMentions: {parse:['users']}, // Not allowed to mention @everyone or @here
shards:'auto', // Automatically determine the number of shards to use
});
DiscordService(client);


// Everywhere I looked, it was advised NOT to use this, however, I have no idea how else to handle this properly.
// MongoDB sometimes likes to close the connection randomly and it doesn't display the stacktrace of the error.
// So I can never find out what's causing it. This is a temporary fix until I can find a better solution.
process.on('uncaughtException', (err) => {
    Logging.fatal(err)  
})
