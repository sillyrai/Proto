import { ChannelType, ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import Logging from "../../../Modules/Logging";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("🗑️ Purges the specified amount of messages")
        .addIntegerOption(option => option.setName("amount").setDescription("The amount of messages to purge").setRequired(true).setMinValue(1).setMaxValue(100))
        .addChannelOption(option => option.setName("channel").setDescription("The channel to purge messages from").setRequired(false).addChannelTypes(ChannelType.GuildText))
        .setDMPermission(false),
    permission: PermissionsBitField.Flags.ManageMessages,

    async execute(int:ChatInputCommandInteraction) {
        try{
            var amount:number = int.options.getInteger("amount") as number;
            var channel = int.options.getChannel("channel") as TextChannel || int.channel as TextChannel;

            // There is a limit of 100 messages per purge, 
            await channel.bulkDelete(amount, true);
            await int.reply({content: `Successfully purged ${amount} messages!`, ephemeral: true});
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}