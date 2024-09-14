import axios from "axios"

describe("Command for getting animal pictures", ()=>{
    it('Should return an image of a fox', ()=>{
        axios.get("https://api.protogen.lol/images/fox").then((response)=>{
            expect(response.data.image).not.toBeNull()
        })
    })
    it('Should return an image of a cat', ()=>{
        axios.get("https://api.protogen.lol/images/cat").then((response)=>{
            expect(response.data.image).not.toBeNull()
        })
    })
})