export default {
    createFor: function(guildId: string){
        return {
            _id: guildId as any,
            starboard: {
                enabled: false,
                symbol: "⭐",
                required: 5,
                channel: null,
                messages: []
            },
            welcomer: {
                enabled: false,
                channel: null,
                joinMessage: `Welcome to the server, {user}!`,
                leaveMessage: `Goodbye, {user}!`
            },
            blacklist:{
                blacklisted: false,
                reason: "No reason specified"
            }
        }
    }
}