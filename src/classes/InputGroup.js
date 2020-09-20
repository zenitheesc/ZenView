const Math = require('mathjs');
const Input = require('./input');
module.exports = class InputGroup {
	constructor(numberOfInputs, isFromJson) {
		this.numberOfInputs;
		this.inputs = [];
		this.rawInputs = [];
		this._associationInput = {};
		this.inputGraph = {};
		if (isFromJson) {
			this.constructFromJson(numberOfInputs);
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
		this._associationInput = inputGroupJSON._associationInput;
	}
	generateInputs() {
		for (let i = 0; i < this.numberOfInputs; i++) {
			let newInput = new Input('collum-' + i, 'collum-' + i);
			this.rawInputs.push(newInput);
			this._associationInput[newInput.name] = newInput;
		}
	}
	addNewInput(inputConfig) {
		console.log(inputConfig);
		if (this._associationInput[inputConfig.name] !== undefined) {
			return {created: false, error: 1, msg: 'Este nome já existe'};
		}/*
		try {
			this.expressionCompiled = Math.compile(newInput.expression);
			this._associationInput[newInput.name] = newInput;
			this.inputs.push(newInput);
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}*/
		let newInput = new Input(String(inputConfig.name),String(inputConfig.expression));
		this._associationInput[newInput.name] = newInput;
		this.inputs.push(newInput);
		return {created: true, name: newInput.name, expression: newInput.expression};
	}
	editInput(inputName, newConfig) {
		if (this._associationInput[inputName] === undefined) {
			return false;
		}
		this._associationInput[inputName].name = newConfig.name;
		this._associationInput[inputName].expression = newConfig.expression;
	}
}