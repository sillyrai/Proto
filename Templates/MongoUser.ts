export default {
    createFor: function(userId: string){
        return {
            _id: userId as any,
            premium: false,
            staff: false,
            blacklist:{
                blacklisted: false,
                reason: "No reason specified"
            },
            commands: []
        }
    }
}