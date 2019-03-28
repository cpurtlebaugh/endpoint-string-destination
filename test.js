'use strict';
const input = `
CREATE fruits
CREATE vegetables
CREATE grains
CREATE fruits/apples
CREATE fruits/apples/fuji
LIST
CREATE grains/squash
MOVE grains/squash vegetables
CREATE foods
MOVE grains foods
MOVE fruits foods
MOVE vegetables foods
LIST
DELETE fruits/apples
DELETE foods/fruits/apples
LIST
`

const exOutput = `
CREATE fruits
CREATE vegetables
CREATE grains
CREATE fruits/apples
CREATE fruits/apples/fuji
LIST
fruits
  apples
    fuji
grains
vegetables
CREATE grains/squash
MOVE grains/squash vegetables
CREATE foods
MOVE grains foods
MOVE fruits foods
MOVE vegetables foods
LIST
foods
  fruits
    apples
      fuji
  grains
  vegetables
    squash
DELETE fruits/apples
Cannot delete fruits/apples - fruits does not exist
DELETE foods/fruits/apples
LIST
foods
  fruits
  grains
  vegetables
    squash
`

function createOutput(input){
	// final values
	let object = {};
	let printOutput = ``;
	// temp action and list of actions
	let action = "";
	let actions = ["MOVE", "CREATE", "DELETE", "LIST"];

	// create reference arrays
	const destinationArr = input.split(/[MOVE]|[CREATE]|[DELETE]|[LIST]/).filter((e) => {
		if(e !== ',' && e !== "" && e !== "/n"){
			return e.trim()
		};
	});

	let actionArr = [];
	input.split("").forEach((e) => {
		if(actions.includes(action)){
			actionArr.push(action);
			action = "";
		} else if(e.match(/[A-Z]/)){
			action += e;
		} 
	});

	// loop through action arr to create obj + print out value
	let destIndex = 0;
	actionArr.forEach((e) => {
			let tempDest;
			switch(true) {
				case e === "LIST":
					console.log("object: ", object);
					let newString = createString(object);
					
					printOutput = `
					${printOutput} 
					LIST ${newString}`.trim();
					break
				case e === "CREATE":
					tempDest = destinationArr[destIndex].trim().split(/[/]|[" "]/);
					tempDest.reduce((o, s) => { return o[s] = {} }, object);
					destIndex += 1;

					printOutput = `
					${printOutput} 
					CREATE ${tempDest}`;
					break;
				case e === "MOVE":
					tempDest = destinationArr[destIndex].trim().split(/[/]|[" "]/);
					object = getByKey(object, tempDest[tempDest.length - 2], tempDest[tempDest.length - 1]);						
					
					printOutput = `
					${printOutput} 
					MOVE ${tempDest}`;
					destIndex += 1;
					break;
				case e === "DELETE":
					tempDest = destinationArr[destIndex].trim().split(/[/]|[""]/);
					Object.keys(object).includes(tempDest[0]) ?
						tempDest.reduce((acc, key, index) => {
							if (index === tempDest.length - 1) {
								delete acc[key];
								printOutput = `
								${printOutput} 
					DELETE ${tempDest}`
							}
							return acc[key];
						}, object) 
					: printOutput = `
					${printOutput} 
					Cannot delete ${destinationArr[destIndex]} - ${tempDest[0]} does not exist.`.trim();
					destIndex += 1;
					break;
			}
	});

	console.log("//// FINAL OBJECT /////") 
	console.log(object)
	return printOutput;
}

// helper function to drill into nested obj, 
// only works a couple items deep right now
// think it's best to create some sort of
// permanent arr of pathways to search for 
// value match to del
function getByKey(obj, key, dest) {
    function iter(o, tempKey) {
        if (o !== null && typeof o === 'object') {
            if (key in o) {
				if(tempKey === undefined){
					let newObj = {[key]: o[key]};
					Object.assign(obj[dest], newObj);
					delete obj[key]
				} else {
					let newObj = {[key]: o[key]};
					Object.assign(obj[dest], newObj);
					delete obj[tempKey][key]									
				}
                return true;
			}
            return Object.keys(o).some((k) => {
				let tempKey = k;
                return iter(o[k], tempKey);
            });
        }
	}
	iter(obj);
    return obj;
}

// this template literal stuff is finicky to format
function createString(obj) {
	let final = [];
    function iter(o) {
        if (o !== null && typeof o === 'object') {
			let keys = Object.keys(o);
			if(keys.length === 0) return true;
			else if (final.length === 0) {
				final = keys.map((e) => {
					return `
					  ${e}`;
				})} 
			else {
				final.forEach((e, i) => {
					console.log("e: ", e);
					console.log("i: ", i);
					if(keys[i] !== undefined){
						final[i] = `${e}  
						${keys[i]}`;
					}
				});
			}
            return Object.keys(o).some((k) => {
                return iter(o[k]);
            });
        }
	}
	iter(obj);

	return final.reverse().map((e) => {
		return `${e}`
	}).join("");
}



// RUN SCRIPT
(() => {
	console.log(createOutput(input))
})();

