//TO DO: add half bag randomization

const template=document.querySelector("template");
const guessContainer=document.querySelector('.guessContainer');
const guestCountSpan=document.querySelector(".guessCount span");
let answerJSON;
let characterJSON;
let guestCount=0;
initialize();

document.querySelector(".submitGuess").addEventListener("click",()=>{
    createGuess();
})


async function initialize(){
    answerJSON=(await getJSONFile("input.json")).current;
    characterJSON=(await getJSONFile("characters.json"));
    console.log(characterJSON);
}

function createGuess(){
    guestCount++;
    document.querySelector(".guessCount span").innerHTML=guestCount;
    //Create circles and apply animation
    let node=document.importNode(template.content,true);
    let circles=node.querySelectorAll(".icon");
    guessContainer.prepend(node);
    circles.forEach((ele,i)=>{
        ele.style.animationDelay=i/10+"s";
    });
}

//Currently assumes input file only contains one clocktower character
async function getJSONFile(input){
    try{
    const response=await fetch(input);
    const data=await response.text();
    return JSON.parse(data);
    }catch{
        alert("Failed to fetch input data!")
    }
   
}

function getAbility(input){
    switch(input){
        case 0:return"Prevents Death";
        case 1:return"On Death";
        case 2:return"Execution";
        case 3:return"Causes Death";
        case 4:return"Droisoning";
        case 5:return"Learns Character";
        case 6:return"Selects Character";
        case 7:return"Specific Character";
        case 8:return"Yes/No";
        case 9:return"Learns Number";
        case 10:return"Public";
        case 11:return"Nomination/Voting";
        case 12:return"Once/First Time";
        case 13:return"Setup";
        case 14:return"Madness";
        case 15:return"Alignment";
        case 16:return"Outsiders";
        case 17:return"Minions";
        case 18:return"Townsfolk";
        case 19:return"Demon";
        case 20:return"Win/Loss";
        case 21:return"Changes Character";
        case 22:return"Can Revive";
        case 23:return"Positioning";
        case 24:return"Storyteller";
        case 25:return"?";
    }
}