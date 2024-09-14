import { ActivityOptions, ActivityType, Client, ClientPresence, PresenceData } from "discord.js";
import Logging from "../../Modules/Logging";
import cron from "cron"

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

var Activities = [
    {name: "discord.gg/x3", type: ActivityType.Watching},
    {name: "you sleep", type: ActivityType.Watching},
    {name: "you", type: ActivityType.Watching},
    {name: "commands", type: ActivityType.Listening},
]
async function updateToRandom(c:Client)
{
    var activity = Activities[Math.floor(Math.random() * Activities.length)]
    await c.user?.setActivity(activity as ActivityOptions)
    Logging.info(`Updated status to ${activity.type} ${activity.name}`)
}


export default async function (client:Client) {
    Logging.ok("RotatingStatus: Ready")

    // create a new cronjob that runs each 10 minutes
    var job = new cron.CronJob("*/10 * * * *", async () => {
        await updateToRandom(client)
    }
    , null, true, "America/New_York")
    job.start()
    await updateToRandom(client)
}
