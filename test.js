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
LIST`

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
	const arr = input.split(" ").join("").split("");
	let action = "";
	let destination = "";
	let final = {};

	arr.forEach((el) => {
		// IF UPPERCASE - CREATES ACTION
		if(el.match(/[A-Z]/)){
			action += el;
		
		// IF LOWERCASE OR SLASH - CREATE DESTINATION
		} else if(el.match(/[a-z]|[/]/)) {
			destination += el
		} else {
		// IF NEITHER - EXECUTES ACTION OF DESTINATION
			switch(true) {
				case action === "CREATE":
					let tempDest = destination.split("/");
					tempDest.reduce(function(o, s) { return o[s] = {} }, final);
					// console.log("final: ", final)
					break;
				case action === "DELETE":
					// check if that object key exists, if so re-write final object
					// if not skip

					break;
				case action === "MOVE":
					// console.log("MOVE DESTINATION", destination)
					break;
				case action === "LIST":
					// print that portion of the final object and it's children
			  }
			// clear temporarily stored values
			action = "";
			destination = "";
		}
	});
	return final;
}

// RUN SCRIPT
(async function testOutput(){
	console.log(createOutput(input))
})();

