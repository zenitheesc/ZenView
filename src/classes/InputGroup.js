const Input = require('./input');
module.exports = class InputGroup {
	constructor(numberOfInputs, isFromJson) {
		this.numberOfInputs;
		this.inputs = [];
		this.rawInputs = [];
		this._associationInput = {};
		this.inputGraph = {};
		this.scope = {};
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
			let newInput = new Input('collum_' + i,1,this.scope);
			this.rawInputs.push(newInput);
			this._associationInput[newInput.name] = newInput;
		}
	}
	addNewInput(inputConfig) {
		console.log(inputConfig);
		if (this._associationInput[inputConfig.name] !== undefined) {
			return {
				created: false,
				msg: 'Este nome já existe'
			};
		}

		let newInput = new Input(inputConfig.name, inputConfig.expression,this.scope);
		this._associationInput[newInput.name] = newInput;
		this.inputs.push(newInput);

		return {
			created: true,
			name: newInput.name,
			expression: newInput.expression
		};

	}
	getInputByName(name){
		return this._associationInput[name];
	}
	editInput(inputName, newConfig) {
		if (this._associationInput[inputName] === undefined) {
			return false;
		}
		this._associationInput[inputName].name = newConfig.name;
		this._associationInput[inputName].expression = newConfig.expression;
	}
};