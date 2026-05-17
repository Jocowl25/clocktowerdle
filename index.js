const template=document.querySelector("template");
const guessContainer=document.querySelector('.guessContainer');
const fakeGuessContainer=document.querySelector('.fakeGuessContainer');
const guestCountSpan=document.querySelector(".guessCount span");
const inputMain=document.querySelector("input.main")
const inputTest=document.querySelector("input.test")
const guessHistory=[];
let answer;
let answerName;
let characterJSON;
let previouslyGuessedSet=new Set();
let previouslyTestedSet=new Set();

let guestCount=0;
initialize();

const areSetsEqual = (a, b) => 
  a.size === b.size && [...a].every(value => b.has(value));

inputMain.addEventListener("keydown",(key)=>{
    if(key=="Enter"){
        let name=toTitleCase(inputMain.value).trim();
        if(name in characterJSON && !(previouslyGuessedSet.has(name))){
            previouslyGuessedSet.add(name)
            createGuess(name,characterJSON[name]);
        }
    }
})

document.querySelector(".guessSubmit").addEventListener("click",()=>{
    let name=toTitleCase(inputMain.value).trim();
    if(name in characterJSON && !(previouslyGuessedSet.has(name))){
        previouslyGuessedSet.add(name)
        createGuess(name,characterJSON[name]);
    }
})

document.querySelector(".fakeGuessSubmit").addEventListener("click",testGuess)
inputTest.addEventListener("keydown",(key)=>{
    if(key=="Enter"){
        testGuess();
    }
})


function testGuess(){
    let name=toTitleCase(inputTest.value).trim();
    if(name in characterJSON && !(previouslyTestedSet.has(name))){
        previouslyTestedSet.add(name)
        inputTest.value="";
        character=characterJSON[name]

        //Create circles
        let node=document.importNode(template.content,true);
        let circles=node.querySelectorAll(".icon");
        fakeGuessContainer.prepend(node);

        //Name
        circles[0].innerHTML=name;
        if(character.characterType<2){
            circles[0].style.color="blue"
        }else{
            circles[0].style.color="red"
        }

        //Script type
        circles[1].innerHTML=getScript(character.originalScript);
        //Character type
        circles[2].innerHTML=getCharType(character.characterType);
        //Wakes in night
        circles[3].innerHTML=getWakesNight(character.wakesInNight);
        //Selects Player
        circles[4].innerHTML=getSelectsPlayer(character.selectsPlayer);
        //Learns info
        circles[5].innerHTML=getLearnsInfo(character.learnsInfo);
        //Ability Details
        let charAbilities=new Set(character.ability)
        for (const value of charAbilities) {
            circles[6].innerHTML+=getAbility(value)+", ";
        }
        circles[6].innerHTML=circles[6].innerHTML.slice(0,-2)
        //Apply animation delay + change circle color
        circles.forEach((ele,i)=>{
            ele.style.animationDelay=i/10+"s";
            ele.style.backgroundColor="darkgrey"
        });
    }
}

async function initialize(){
    characterJSON=(await getJSONFile("characters.json"));
    answerName=(await getJSONFile("answer.json")).current
    answer=characterJSON[answerName];
}

function createGuess(name,character){
    document.querySelector(".bigLabels").style.display="flex";
    let correct=0;
    guestCount++;
    document.querySelector(".guessCount span").innerHTML=guestCount;
    inputMain.value="";
    
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
        guessHistory.push("🟩")
    }else{
        guessHistory.push("⬛")
    }

    //Character type
    circles[2].innerHTML=getCharType(character.characterType);
   
    if(character.characterType==answer.characterType){
        circles[2].classList.add("correct")
        correct++
        guessHistory.push("🟩")
    }else if(
    (character.characterType<2&&answer.characterType<2)||
    (character.characterType>=2&&answer.characterType>=2)){
        circles[2].classList.add("almost")
        guessHistory.push("🟨")
    }else{
        guessHistory.push("⬛")
    }

    //Wakes in night
    circles[3].innerHTML=getWakesNight(character.wakesInNight);
    if(character.wakesInNight==answer.wakesInNight){
        circles[3].classList.add("correct")
        correct++
        guessHistory.push("🟩")
    }else if(wakesInNightMatch(character)){
        circles[3].classList.add("almost");
        guessHistory.push("🟨")
    }else{
        guessHistory.push("⬛")
    }


    //Selects Player
    circles[4].innerHTML=getSelectsPlayer(character.selectsPlayer);
    if(character.selectsPlayer==answer.selectsPlayer){
        circles[4].classList.add("correct")
        correct++
        guessHistory.push("🟩")
    }else if(selectsPlayerMatch(character)){
        circles[4].classList.add("almost");
        guessHistory.push("🟨")
    }else{
        guessHistory.push("⬛")
    }

    //Learns info
    circles[5].innerHTML=getLearnsInfo(character.learnsInfo);
    if(character.learnsInfo==answer.learnsInfo){
        circles[5].classList.add("correct")
        correct++
        guessHistory.push("🟩")
    }else{
        guessHistory.push("⬛")
    }

    //Ability Details
    let charAbilities=new Set(character.ability)
    let answerAbilities=new Set(answer.ability)
    for (const value of charAbilities) {
        circles[6].innerHTML+=getAbility(value)+", ";
    }
    circles[6].innerHTML=circles[6].innerHTML.slice(0,-2)
    
    let sameValues=charAbilities.intersection(answerAbilities)
    if(areSetsEqual(charAbilities,answerAbilities)){
        circles[6].classList.add("correct")
        correct++
        guessHistory.push("🟩")
    }else if(sameValues.size!=0){
        circles[6].classList.add("almost")
        guessHistory.push("🟨")
    }else{
        guessHistory.push("⬛")
    }
    circles[6].innerHTML+=` [${sameValues.size}]`

    //Apply animation delay
    circles.forEach((ele,i)=>{
        ele.style.animationDelay=i/10+"s";
    });

    if(correct==6){
        window.setTimeout(showWin,1000)
    }
}

function showWin(){
    selectionCont=document.querySelector(".selectionContainer")
    selectionCont.style.maxHeight=0;
    selectionCont.style.opacity=0;
    selectionCont.querySelector("input").disabled=true;
    selectionCont.querySelector("button").disabled=true;

    completeCont=document.querySelector(".completeContainer");
    completeCont.style.maxHeight="500px";
    completeCont.style.opacity="100%";

    guestCount==1 ? endString="" : endString="es"
    endString=`${guestCount} guess${endString}`;
    completeCont.querySelector("h2").innerHTML+=`${answerName} in ${endString}!`;

    emojiDiv=completeCont.querySelector(".emoji");
    console.log(guessHistory)
    for(let i=0;i<guessHistory.length;i++){
        if(i%6==0&&i!=0){
            emojiDiv.innerHTML+="<br>"
        }
        emojiDiv.innerHTML+=guessHistory[i];
    }

    document.querySelector(".completeContainer button").addEventListener("click",()=>{
        let text=emojiDiv.innerHTML;
        text=text.replaceAll("<br>","\r\n")
        text=`🕰️🩸 I Guessed the Character in Clocktowerdle in ${endString}! 🩸🕰️\r\n`+text;
        text+="\r\nhttps://jocowl25.github.io/clocktowerdle/";
        copyToClipboard(text)
    })
}

async function copyToClipboard(text){
  try {
    await navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
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

