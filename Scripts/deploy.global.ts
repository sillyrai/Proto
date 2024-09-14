import { Locale, REST, Routes, SlashCommandBuilder, SlashCommandMentionableOption } from "discord.js";
import fs from "fs"
import Logging from "../Modules/Logging";
import ansi from "ansi-colors"

var config = require("../config.json")
var commands:Array<SlashCommandBuilder> = []

function load(path:string){
    fs.readdirSync(path).forEach((file) => {
        if(fs.lstatSync(`${path}/${file}`).isDirectory()){
            load(`${path}/${file}`)
        }else if(file.endsWith('.ts')){
            try {
                var cmd = require(`../${path}/${file}`)
                commands.push(cmd.data)
                Logging.info(`Loaded command ${file}`)
            } catch (error) {
                Logging.error(`Failed to load command ${file}`)
                Logging.error(error)
            }
        }
    })
}
load('./Discord/SlashCommands')

// Configure translations
fs.readdirSync("./Languages").forEach((langFile) => {
    if(!langFile.endsWith(".json")) return;
    var lang = require(`../Languages/${langFile}`)
    commands.forEach((cmd) => {
        if(lang["commands"][cmd.name])
        {
            // locale; name
            var locale = langFile.split(".")[0] as string
            var name = lang["commands"][cmd.name].name as string
            var description = lang["commands"][cmd.name].description as string

            Logging.ok(`Loaded ${ansi.yellow(locale)} translation for ${ansi.blue(cmd.name)}`)
            cmd.setNameLocalization(locale as Locale, name)
            cmd.setDescriptionLocalization(locale as Locale, description)
        }
    })
})


const rest = new REST().setToken(config.discord.token);
(async () => {
	try {
		Logging.info(`Started refreshing ${commands.length} application (/) commands.`);
        const data:any = await rest.put(
			Routes.applicationCommands(config.discord.clientId),
			{ body: commands },
		);
		Logging.info(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		Logging.error(error);
        console.log(error)
	}
})();