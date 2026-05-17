const template=document.querySelector("template");
const guessContainer=document.querySelector('.guessContainer');
const fakeGuessContainer=document.querySelector('.fakeGuessContainer');
const guestCountSpan=document.querySelector(".guessCount span");
const inputMain=document.querySelector("input.main")
const inputTest=document.querySelector("input.test")
const colorHistory=[];
let answer;
let answerName;
let characterJSON;
let previouslyGuessedSet=new Set();
let previouslyTestedSet=new Set();
let guessCount=0;

let characterHistory=[];
initialize();


async function initialize(){
    characterJSON=(await getJSONFile("characters.json"));
    answerName=decrypt((await getJSONFile("answer.json")).current)
    answer=characterJSON[answerName];
    
    let localHistory=localStorage.getItem("history")
    if(localHistory!=null){
        characterHistory=localHistory.split(",");
        for(let i=0;i<characterHistory.length;++i){
            createGuess(true,characterHistory[i])
        }
    }
}

const mod = (n, m) => ((n % m) + m) % m;

const areSetsEqual = (a, b) => 
  a.size === b.size && [...a].every(value => b.has(value));

function toTitleCase(str) {
  return str.toLowerCase().replace(/(?:^|[\s-/])\w/g, function(match) {
    return match.toUpperCase();
  });
}

inputMain.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
        console.log("eee")
            createGuess(true);
    }
})

document.querySelector(".guessSubmit").addEventListener("click",()=>{
        createGuess(true);
})

document.querySelector(".fakeGuessSubmit").addEventListener("click",()=>{
    createGuess(false)
})

inputTest.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
        createGuess(false);
    }
})

function createGuess(full,recap=false){
    let inputHTML;
    let prevSet=new Set();
    let inputValue
    if(recap){
        inputValue=recap;
    }else{
        if(full){
            inputHTML=inputMain;
            prevSet=previouslyGuessedSet
        }else{
            inputHTML=inputTest;
            prevSet=previouslyTestedSet
        }
        inputValue=inputHTML.value;
    }
    let name=toTitleCase(inputValue).trim();
    if(name in characterJSON && !(prevSet.has(name))){
        prevSet.add(name);
        if(!recap){
            inputHTML.value="";
        }
        let character=characterJSON[name];

        //Create circles
        let node=document.importNode(template.content,true);
        let circles=node.querySelectorAll(".icon");
        if(guessCount==0){
        document.querySelector(".bigLabels").classList.remove("hide");
        }
        if(full){
            guessContainer.prepend(node);
        }else{
            fakeGuessContainer.prepend(node);
        }
        
        addText(circles,character,name)

        if(full){
            guestCountSpan.innerHTML=++guessCount;
            let totalCorrect=validateGuess(circles,character,name)
            if(totalCorrect==6){
                if(recap){
                    showWin()
                }else{
                    window.setTimeout(showWin,1000)
                }
            }   
            if(!recap){
                characterHistory.push(name)
                localStorage.setItem("history",characterHistory.join(","))
            }
        }

        //Apply animation delay + set circle color
        circles.forEach((ele,i)=>{
            ele.style.animationDelay=i/10+"s";
            if(!full){
                ele.style.backgroundColor="darkgrey"
            }
        });
    }
}

function addText(circles,character,name){
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
}

function decrypt(word){
    const alphabet="qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM- ".split("")
    const cShift=17
    wordList=word.split("");
    for(let i=0;i<wordList.length;++i){
        letter=wordList[i]
        oldIndex=alphabet.indexOf(letter)
        wordList[i]=alphabet[mod((oldIndex-cShift),alphabet.length)]
    }
    return wordList.join("")

}

function compareCircles(circle,character,checks){
    if(checks[0]){
        circle.classList.add("correct")
        colorHistory.push("🟩")
        return 1
    }else if(checks[1]){
        circle.classList.add("almost")
        colorHistory.push("🟨")
    }else{
        colorHistory.push("⬛")
    }
    return 0
}

function validateGuess(circles,character,name){
    let correct=0;

    //Script type
    let checks=[character.originalScript==answer.originalScript,false]
    correct+=compareCircles(circles[1],character,checks)

    //Character type
    checks=[character.characterType==answer.characterType,
    (character.characterType<2&&answer.characterType<2)||
    (character.characterType>=2&&answer.characterType>=2)]
    
    correct+=compareCircles(circles[2],character,checks)

    //Wakes in night
    checks=[character.wakesInNight==answer.wakesInNight,
    wakesInNightMatch(character)]
    correct+=compareCircles(circles[3],character,checks)
    
    //Selects Player
    checks=[character.selectsPlayer==answer.selectsPlayer,
    selectsPlayerMatch(character)]
    correct+=compareCircles(circles[4],character,checks)

    //Learns info
    checks=[character.learnsInfo==answer.learnsInfo,false]
    correct+=compareCircles(circles[5],character,checks)

    //Ability Details
    let charAbilities=new Set(character.ability)
    let answerAbilities=new Set(answer.ability)
    let sameValues=charAbilities.intersection(answerAbilities)
    
    checks=[areSetsEqual(charAbilities,answerAbilities),sameValues.size!=0]
    correct+=compareCircles(circles[6],character,checks)

    circles[6].innerHTML+=` [${sameValues.size}]`

    return correct;
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

function showWin(){
    selectionCont=document.querySelector(".selectionContainer")
    selectionCont.style.maxHeight=0;
    selectionCont.style.opacity=0;
    selectionCont.querySelector("input").disabled=true;
    selectionCont.querySelector("button").disabled=true;

    completeCont=document.querySelector(".completeContainer");
    completeCont.style.maxHeight="500px";
    completeCont.style.opacity="100%";

    guessCount==1 ? endString="" : endString="es"
    endString=`${guessCount} guess${endString}`;
    completeCont.querySelector("h2").innerHTML+=`${answerName} in ${endString}!`;

    emojiDiv=completeCont.querySelector(".emoji");
    for(let i=0;i<colorHistory.length;i++){
        if(i%6==0&&i!=0){
            emojiDiv.innerHTML+="<br>"
        }
        emojiDiv.innerHTML+=colorHistory[i];
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

async function getJSONFile(input){
    let response;
    try{
        response=await fetch(input);
        const data=await response.text();
        return JSON.parse(data);
    }catch{
        alert(`Failed to fetch input data! HTTP Error: ${response.status}`)
    }
   
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

