import IncorrectQuotes from '../../Modules/IncorrectQuotes'

describe("Incorrect quotes", ()=>{
    it('should return a quote for 1 person', ()=>{
        expect(IncorrectQuotes.generate("name1")).not.toBeNull()
    })
    it('should return a quote for 2 people', ()=>{
        expect(IncorrectQuotes.generate("name1", "name2")).not.toBeNull()
    })
    it('should return a quote for 3 people', ()=>{
        expect(IncorrectQuotes.generate("name1", "name2", "name3")).not.toBeNull()
    })
    it('should return a quote for 4 people', ()=>{
        expect(IncorrectQuotes.generate("name1", "name2", "name3", "name4")).not.toBeNull()
    })
    it('should return a quote for 5 people', ()=>{
        expect(IncorrectQuotes.generate("name1", "name2", "name3", "name4", "name5")).not.toBeNull()
    })
    it('should return a quote for 6 people', ()=>{
        expect(IncorrectQuotes.generate("name1", "name2", "name3", "name4", "name5", "name6")).not.toBeNull()
    })
    it('should not return a quote for 0 people', ()=>{
        expect(IncorrectQuotes.generate()).toBeNull()
    })
})