import axios from 'axios'

export default {
    getRandomRedditPost: async function(subreddit:string) {
        // remove r/ if it exists
        try
        {
            subreddit =subreddit.replace(/r\//g, '')
            var res = await axios.get(`https://www.reddit.com/r/${subreddit}/random.json`, {
                maxRedirects: 10, // AUUUUUGH
            })
            var js = JSON.parse(JSON.stringify(res.data))
            var children:any = null;
            if(Array.isArray(js))
                children = js[0].data.children
            else
                children = js.data.children
            var post:any = null;
            post = children[Math.floor(Math.random() * children.length)].data
            return post
        }
        catch{
            return null
        }
    }
}
