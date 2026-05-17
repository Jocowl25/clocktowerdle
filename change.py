import random
import json

alphabet="qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM- "
cShift=17

def ceasar(word,decode=False):
    change=1
    if(decode):
        change=-1
    wordList=list(word)
    for i in range(0,len(wordList)):
        letter=wordList[i]
        oldIndex=alphabet.find(letter)
        wordList[i]=alphabet[(oldIndex+cShift*change)%len(alphabet)]
    return "".join(wordList)


#load names
characters=json.loads(open("characters.json").read())
names=list(characters.keys())
nameSize=len(names)

#load history
inputJSON=json.loads(open("answer.json").read())
history=inputJSON["history"]
historyUnordered=set(history)

#remove oldest member and add previous day's entry
if(len(historyUnordered)>=nameSize//2):
    history.pop()

history.insert(0,ceasar(inputJSON["current"],True))
#loop until non-recent character is found
newCurrentFound=False
nextChar=""
while(not newCurrentFound):
    randIndex=random.randint(0,nameSize-1)
    nextChar=names[randIndex]
    if(not nextChar in historyUnordered):
        newCurrentFound=True

updatedInputJSON= {
    "current":ceasar(nextChar),
    "history":history
}

with open("answer.json", "w") as file:
    json.dump(updatedInputJSON, file, indent=4)
