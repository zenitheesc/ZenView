const Input = require('./input');

module.exports = class InputGroup {

	constructor(numberOfInputs, isFromJson) {

		this.numberOfInputs;
		this.inputs = [];
		this.rawInputs = [];
		this.inputsDictionary = {};
		this.scope = {};

		if (isFromJson) {

			this.constructFromJson(numberOfInputs);

		} else {

			this.newConstructor(numberOfInputs);

		}

	}

	newConstructor(numberOfInputs) {

		this.inputsDictionary = {};
		this.numberOfInputs = numberOfInputs;
		this.generateInputs();

	}

	constructFromJson(inputGroupJSON) {

		this.numberOfInputs = inputGroupJSON.numberOfInputs;

		inputGroupJSON.inputs.forEach((input) => {

			const newInput = new Input(input.name, input.expression, this.scope);
			this.inputs.push(newInput);
			this.inputsDictionary[newInput.name] = newInput;

		});

		inputGroupJSON.rawInputs.forEach((input) => {

			const newInput = new Input(input.name, input.expression, this.scope);
			this.rawInputs.push(newInput);
			this.inputsDictionary[newInput.name] = newInput;

		});

	}

	generateInputs() {

		for (let i = 0; i < this.numberOfInputs; i++) {

			const expression = {
				formatted: `${'collum_' + i}`,
			};
			const newInput = new Input('collum_' + i, expression, this.scope);
			this.rawInputs.push(newInput);
			this.inputsDictionary[newInput.name] = newInput;

		}

	}

};
