import random
import json

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

history.insert(0,inputJSON["current"])

#loop until non-recent character is found
newCurrentFound=False
nextChar=""
while(not newCurrentFound):
    randIndex=random.randint(0,nameSize-1)
    nextChar=names[randIndex]
    if(not nextChar in historyUnordered):
        newCurrentFound=True

updatedInputJSON= {
    "current":nextChar,
    "history":history
}

with open("answer.json", "w") as file:
    json.dump(updatedInputJSON, file, indent=4)
