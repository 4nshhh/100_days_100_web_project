


function findchar(ans,prop,remainingCharacters){

return remainingCharacters.filter(character=> {
    if(character[prop]===ans){
        console.log(character)
        return character;
    }
})

}

export default findchar

