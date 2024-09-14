import { Client, Events } from "discord.js";
import Logging from "../../Modules/Logging";

export default async function(c:Client)
{
    Logging.ok("ButtonListener: Ready")
    c.on(Events.InteractionCreate, async (int) => {
        if(int.isButton())
        {
            if(int.customId == "delete")
            {
                await int.message.delete()
            }
        }
    })
}