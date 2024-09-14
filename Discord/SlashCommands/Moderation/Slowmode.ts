import { ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import Logging from "../../../Modules/Logging";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slowmode")
        .setDescription("🐌 Set the slowmode of a channel (0 to disable)")
        .addIntegerOption(option => option.setName("seconds").setDescription("The amount of seconds to set the slowmode to").setRequired(true).setMinValue(0).setMaxValue(21600))
        .setDMPermission(false),
    permission: PermissionsBitField.Flags.ManageChannels,

    async execute(int:ChatInputCommandInteraction) {
        try{
            var seconds:number = int.options.getInteger("seconds") as number;
            var channel = int.channel as TextChannel;

            await channel.setRateLimitPerUser(seconds);
            await int.reply({content: `Successfully set the slowmode to ${seconds} seconds!`});
        }
        catch(err){
            Logging.error(err);
            return;
        }
    }
}