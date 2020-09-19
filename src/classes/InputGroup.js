const Input = require('./input');
module.exports = class InputGroup {
	constructor(numberOfInputs) {
		this.numberOfInputs;
		this.inputs = [];
		this.rawInputs = [];
		if (arguments.length === 2) {
			this.constructFromJson();
		} else {
			this.newConstructor(numberOfInputs);
		}
	}
	newConstructor(numberOfInputs) {
		this._associationInput = {};
		this.numberOfInputs = numberOfInputs;
		this.generateInputs();
	}
	constructFromJson(inputGroupJSON) {
		this.numberOfInputs = inputGroupJSON.numberOfInputs;
		this.rawInputs = inputGroupJSON.rawInputs;
		this.inputs = inputGroupJSON.inputs;
	}
	generateInputs() {
		for (let i = 0; i < this.numberOfInputs; i++) {
			let newInput = new Input('collum-' + i, 'collum-' + i);
			this.rawInputs.push(newInput);
			this._associationInput[newInput.name] = newInput;
		}
	}
	addNewinput(newInput) {
		if (this._associationInput[newInput.name] !== undefined) {
			return false;
		}
		this._associationInput[newInput.name] = newInput;
		this.inputs.push(newInput);
	}
	editInput(inputName, newConfig) {
		if (this._associationInput[inputName] === undefined) {
			return false;
		}
		this._associationInput[inputName].name = newConfig.name;
		this._associationInput[inputName].expression = newConfig.expression;
	}
}