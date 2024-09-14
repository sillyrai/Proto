import rapi from "../../Modules/rAPI"

describe('Reddit likes to return data in different ways each time, check if its valid', ()=>{
    it('Should be able to get \'selftext\' from r/copypasta', async ()=>{
        var post:any = await rapi.getRandomRedditPost('copypasta')
        expect(post).not.toBeUndefined()
        expect(post?.selftext).not.toBeUndefined()
    })
    it('Should be able to get \'selftext\' from r/furry', async ()=>{
        var post:any = await rapi.getRandomRedditPost('furry')
        expect(post).not.toBeUndefined()
        expect(post?.selftext).not.toBeUndefined()
    })
    it('Should be able to get \'selftext\' from r/gfur', async ()=>{
        var post:any = await rapi.getRandomRedditPost('gfur')
        expect(post).not.toBeUndefined()
        expect(post?.selftext).not.toBeUndefined()
    })

    it('Should not be able to retrieve a post from r/thissubredditdoesnotexist', async ()=>{
        var post:any = await rapi.getRandomRedditPost('thissubredditdoesnotexist')
        expect(post).toBeNull()
    })
})