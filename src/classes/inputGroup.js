const Input = require('./input');
module.exports = class InputGroup {

	/**
	 * Creates an instance of InputGroup.
	 * @param {number} numberOfInputs
	 * @param {boolean} isFromJson

	 */
	constructor(numberOfInputs, isFromJson) {

		this.numberOfInputs;
		this.inputs = [];
		this.rawInputs = [];
		this.inputsDictionary = {};
		this.scope = {};
		//this.inputGraph = new InputGraph();
		this.initReadFunction();

		if (isFromJson) {

			this.constructFromJson(numberOfInputs);

		} else {

			this.newConstructor(numberOfInputs);

		}

	}

	initReadFunction() {


		window.addEventListener('DataIsReady', (evt) => {

			this.solve(evt.detail);

		});

	}

	/**
	 *
	 *
	 * @param {*} numberOfInputs
	 */
	newConstructor(numberOfInputs) {

		this.inputsDictionary = {};
		this.numberOfInputs = numberOfInputs;
		this.generateInputs();

	}

	/**
	 *
	 *
	 * @param {*} inputGroupJSON
	 */
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

	/**
	 *
	 *
	 */
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

	solve(data) {

		for (let i = 0; i < data.length; i++) {

			this.scope['collum_' + i] = data[i];

		}

		this.inputGraph.inputs.forEach((input) => {

			input.evaluate();

		});

		console.log(this.scope);

		window.dispatchEvent(new CustomEvent('DataIsProcessed', {detail: this.scope}));

	}

};