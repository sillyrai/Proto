import { SlashCommandBuilder } from "discord.js"
import fs from "fs"

var commands:Array<SlashCommandBuilder> = []

function load(path: string)
{
    fs.readdirSync(path).forEach(file => {
        // Check if its a directory
        if(fs.lstatSync(path + "/" + file).isDirectory())
        {
            load(path + "/" + file)
        }
        else
        {
            // Check if its a .ts file
            if(file.endsWith(".ts"))
            {
                // Load the command
                var command = require(`../${path}/${file}`)
                commands.push(command.data)
            }
        }
    })
}
load("./Discord/SlashCommands")

// Convert to JSON en-US.jsonD

var json:any = {}
var cmds:any = json["commands"] = {}
commands.forEach(command => {
    cmds[command.name] = {
        "name": command.name,
        "description": command.description,
    }
})
fs.writeFileSync("./en-US.json", JSON.stringify(json, null, 4))