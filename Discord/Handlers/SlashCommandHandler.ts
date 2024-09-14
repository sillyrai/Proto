import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import fs from "fs"
import Logging from "../../Modules/Logging";

var config = require("../../config.json");

export default async function (scc:ChatInputCommandInteraction, CommandCache:Map<string, any>){
    // Check if command exists
    if(!CommandCache.has(scc.commandName)){
        Logging.debug(`SlashCommandHandler: Command ${scc.commandName} does not exist`)
        return;
    }

    // Get command
    var cmd = CommandCache.get(scc.commandName)
    try {
        // Check for permissions first
        var perm:PermissionsBitField = cmd.permission ?? PermissionsBitField.Flags.SendMessages
        if(!scc.memberPermissions?.has(perm))
        {
            var err = new EmbedBuilder()
            err.setTitle(":warning: Missing Permissions")
            err.setDescription(`You do not have permission to use this command.`)
            err.setColor("#FECB4D")
            err.setTimestamp(new Date())

            await scc.reply({embeds: [err]})
            return;
        }
        cmd.execute(scc)
    } catch (error) {
        Logging.error(`Failed to execute command ${cmd.name}`)
        Logging.error(error)
    }

    /*
    fs.readdirSync("./Discord/SlashCommands").forEach((dir) => {
        fs.readdirSync(`./Discord/SlashCommands/${dir}`).forEach(async(file) => {
            if(!file.endsWith(".ts")) return;

            var cmd = requireUncached(`../SlashCommands/${dir}/${file}`)
            if(cmd.data.name == scc.commandName){
                try {
                    // Check for permissions first
                    var perm:PermissionsBitField = cmd.permission ?? PermissionsBitField.Flags.SendMessages
                    if(!scc.memberPermissions?.has(perm))
                    {
                        var err = new EmbedBuilder()
                        err.setTitle(":warning: Missing Permissions")
                        err.setDescription(`You do not have permission to use this command.`)
                        err.setColor("#FECB4D")
                        err.setTimestamp(new Date())

                        await scc.reply({embeds: [err]})
                        return;
                    }

                    cmd.execute(scc)
                } catch (error) {
                    Logging.error(`Failed to execute command ${cmd.name}`)
                    Logging.error(error)
                }
            }
        })
    })
    */
}