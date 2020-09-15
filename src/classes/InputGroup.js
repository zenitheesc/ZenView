const Input = require('./input');
module.exports = class InputGroup {
	constructor(numberOfEntries) {
		this.numberOfEntries;
		this.Inputs;
		if (arguments.length === 1) {
			this.constructFromJson();
		} else {
			this.newConstructor(numberOfEntries);
		}
	}
	newConstructor(numberOfEntries) {
		
		this.numberOfEntries = numberOfEntries;
		this.Inputs;
		this.inputs = new InputGroup();
	}
	constructFromJson(inputGroupJSON) {
		this.numberOfEntries = inputGroupJSON.numberOfEntries;
		this.Inputs = inputGroupJSON.Inputs;
	}
	generateInputs() {
		for (let i = 0; i < this.nbmrInputs; i++) {
			let newInput = new Input('NewInput' + i, 'col' + i, 'receiver');
			this.inputs.push(newInput);
			this._associationInput[newInput.name] = newInput;
		}
	}
}