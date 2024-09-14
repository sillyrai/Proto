import { SlashCommandBuilder,REST, Routes, Locale } from "discord.js";
import Logging from "../../Modules/Logging";
import fs from 'fs'

var config = require("../config.json")

var commands:Array<SlashCommandBuilder> = []
function loadFromDirectory(path:string){
    // If file is a directory, loadFromDirectory
    // If file is a .ts file, load it
    fs.readdirSync(path).forEach((file) => {
        if(fs.lstatSync(`${path}/${file}`).isDirectory()){
            loadFromDirectory(`${path}/${file}`)
        }else if(file.endsWith('.ts')){
            // Logging.info(`Loading command ${file}`)
            try {
                var cmd = require(`../${path}/${file}`)
                // Look for associated translations aswell
                fs.readdirSync("./Languages").forEach((langFile) => {
                    if(!langFile.endsWith(".json")) return;
                    var lang = require(`../Languages/${langFile}`)
                    if(lang["commands"][cmd.data.name])
                    {
                        // locale; name
                        var locale = langFile.split(".")[0] as string
                        var name = lang["commands"][cmd.data.name].name as string
                        var description = lang["commands"][cmd.data.name].description as string

                        console.log(`Loaded ${locale} translation for ${cmd.data.name}`)
                        cmd.data.setNameLocalization(locale as Locale, name)
                        cmd.data.setDescriptionLocalization(locale as Locale, description)
                    }
                })

                commands.push(cmd.data)
                Logging.ok(`Loaded command ${file}`)
            } catch (error) {
                Logging.error(`Failed to load command ${file}`)
                Logging.error(error)
            }
        }
    })
}
loadFromDirectory('./Discord/SlashCommands')

const rest = new REST().setToken(config.discord.token);

(async () => {
	try {
		Logging.info(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data:any = await rest.put(
			Routes.applicationCommands(config.discord.clientId),
			{ body: [] },
		);

		Logging.info(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		Logging.error(error);
	}
})();