//TO DO: add half bag randomization

const template=document.querySelector("template");
let guessContainer=document.querySelector('.guessContainer');


initialize();
async function initialize(){
    let answerJSON=await getAnswer();
    let node=document.importNode(template.content,true);
    guessContainer.prepend(node);
    
    node=document.importNode(template.content,true);
    guessContainer.prepend(node);
    
    console.log(answerJSON);
}

//Currently assumes input file only contains one clocktower character
async function getAnswer(){
    try{
    const response=await fetch("input.txt");
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