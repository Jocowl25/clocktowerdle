const template=document.querySelector("template");
const guessContainer=document.querySelector('.guessContainer');
const guestCountSpan=document.querySelector(".guessCount span");
const inputHTML=document.querySelector("input")
let answer;
let characterJSON;
let previouslyGuessedSet=new Set();

let guestCount=0;
initialize();

const areSetsEqual = (a, b) => 
  a.size === b.size && [...a].every(value => b.has(value));

document.querySelector(".guessSubmit").addEventListener("click",()=>{
    let name=toTitleCase(inputHTML.value);
    console.log(name)
    if(name in characterJSON && !(previouslyGuessedSet.has(name))){
        previouslyGuessedSet.add(name)
        createGuess(name,characterJSON[name]);
    }
})


async function initialize(){
    answer=(await getJSONFile("input.json")).current;
    characterJSON=(await getJSONFile("characters.json"));
}

function createGuess(name,character){
    let correct=0;
    guestCount++;
    document.querySelector(".guessCount span").innerHTML=guestCount;
    inputHTML.value="";
    
    //Create circles
    let node=document.importNode(template.content,true);
    let circles=node.querySelectorAll(".icon");
    guessContainer.prepend(node);

    //Name
    circles[0].innerHTML=name;
    if(character.characterType<2){
        circles[0].style.color="blue"
    }else{
        circles[0].style.color="red"
    }

    //Script type
    circles[1].innerHTML=getScript(character.originalScript);
    if(character.originalScript==answer.originalScript){
        circles[1].classList.add("correct")
        correct++
    }

    //Character type
    circles[2].innerHTML=getCharType(character.characterType);
   
    if(character.characterType==answer.characterType){
        circles[2].classList.add("correct")
        correct++
    }else if(
    (character.characterType<2&&answer.characterType<2)||
    (character.characterType>=2&&answer.characterType>=2)){
        circles[2].classList.add("almost")
    }

    //Wakes in night
    circles[3].innerHTML=getWakesNight(character.wakesInNight);
    if(character.wakesInNight==answer.wakesInNight){
        circles[3].classList.add("correct")
        correct++
    }else if(wakesInNightMatch(character)){
        circles[3].classList.add("almost");
    }


    //Selects Player
    circles[4].innerHTML=getSelectsPlayer(character.selectsPlayer);
    if(character.selectsPlayer==answer.selectsPlayer){
        circles[4].classList.add("correct")
        correct++
    }else if(selectsPlayerMatch(character)){
        circles[4].classList.add("almost");
    }

    //Learns info
    circles[5].innerHTML=getLearnsInfo(character.learnsInfo);
    if(character.learnsInfo==answer.learnsInfo){
        circles[5].classList.add("correct")
        correct++
    }

    //Ability Details
    let charAbilities=new Set(character.ability)
    let answerAbilities=new Set(answer.ability)
    for (const value of charAbilities) {
        console.log(value)
        circles[6].innerHTML+=getAbility(value)+", ";
    }
    circles[6].innerHTML=circles[6].innerHTML.slice(0,-2)
    let sameValues=charAbilities.intersection(answerAbilities)
    if(areSetsEqual(charAbilities,answerAbilities)){
        circles[6].classList.add("correct")
        correct++
    }else if(sameValues.size!=0){
        circles[6].classList.add("almost")
    }
    circles[6].innerHTML+=` [${sameValues.size}]`

    //Apply animation delay
    circles.forEach((ele,i)=>{
        ele.style.animationDelay=i/10+"s";
    });
}



function selectsPlayerMatch(character){
    if(character.selectsPlayer==3||answer.selectsPlayer==3){
        return false;
    }
    charIsNo=(character.selectsPlayer==0);
    answerIsNo=(answer.selectsPlayer==0);
    return charIsNo==answerIsNo
}

function wakesInNightMatch(character){
    if(character.wakesInNight==5||answer.wakesInNight==5){
        return false;
    }
    charIsNo=(character.wakesInNight==0);
    answerIsNo=(answer.wakesInNight==0);
    return charIsNo==answerIsNo
}

async function getJSONFile(input){
    try{
    const response=await fetch(input);
    const data=await response.text();
    return JSON.parse(data);
    }catch{
        alert("Failed to fetch input data!")
    }
   
}

//Converts string to title case
function toTitleCase(str) {
  return str.toLowerCase().replace(/(?:^|[\s-/])\w/g, function(match) {
    return match.toUpperCase();
  });
}

function getScript(input){
    switch(input){
        case 0:return "Trouble Brewing";
        case 1:return "Sects and Violets";
        case 2:return "Bad Moon Rising";
        case 3:return "Experimental";
    }
}

function getCharType(input){
     switch(input){
        case 0:return "Townsfolk";
        case 1:return "Outsider";
        case 2:return "Minion";
        case 3:return "Demon";
    }
}

function getWakesNight(input){
    switch(input){
        case 0:return "No";
        case 1:return "Sometimes";
        case 2:return "Once";
        case 3:return "Always";
        case 4:return "Always (Except first)";
        case 5:return "?";
    }
}

function getSelectsPlayer(input){
     switch(input){
        case 0:return "No";
        case 1:return "Optionally";
        case 2:return "Required";
        case 3:return "?";
    }
}

function getLearnsInfo(input){
    switch(input){
        case 0:return "No";
        case 1:return "Yes";
        case 2:return "?";
    }
}

function getAbility(input){
    switch(input){
        case 0:return "Prevents Death";
        case 1:return "On Death";
        case 2:return "Execution";
        case 3:return "Causes Death";
        case 4:return "Droisoning";
        case 5:return "Learns Character";
        case 6:return "Selects Character";
        case 7:return "Specific Character";
        case 8:return "Yes/No";
        case 9:return "Learns Number";
        case 10:return "Public";
        case 11:return "Nomination/Voting";
        case 12:return "Once/First Time";
        case 13:return "Setup";
        case 14:return "Madness";
        case 15:return "Alignment";
        case 16:return "Outsiders";
        case 17:return "Minions";
        case 18:return "Townsfolk";
        case 19:return "Demon";
        case 20:return "Win/Loss";
        case 21:return "Changes Character";
        case 22:return "Can Revive";
        case 23:return "Positioning";
        case 24:return "Storyteller";
        case 25:return "?";
    }
}

