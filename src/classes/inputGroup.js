const Input = require('./input');
const InputGraph = require('./inputGraph');
const create = require('mathjs').create;
const all = require('mathjs').all;
const Math = require('mathjs');
module.exports = class InputGroup {

	/**
	 * Creates an instance of InputGroup.
	 * @param {number} numberOfInputs
	 * @param {boolean} isFromJson

	 */
	constructor(numberOfInputs, isFromJson) {
		this.customMath;
		this.numberOfInputs;
		this.inputs = [];
		this.rawInputs = [];
		this._associationInput = {};
		this.scope = {};
		this.inputGraph = new InputGraph();
		this.initReadFunction();

		if (isFromJson) {

			this.constructFromJson(numberOfInputs);

		} else {

			this.newConstructor(numberOfInputs);

		}
		this.initGraph();

	}

	initGraph() {
		this.inputGraph.addEgdes();
		this.inputGraph.hasCycle();
		this.inputGraph.topologicalSort();
	}

	initReadFunction() {
		this.customMath = Math.create(Math.all);

		window.addEventListener('dataIsReady', (evt) => {
			this.solve(evt.detail);
		});
	}

	/**
	 *
	 *
	 * @param {*} numberOfInputs
	 */
	newConstructor(numberOfInputs) {

		this._associationInput = {};
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

		inputGroupJSON.inputs.forEach(input => {
			let newInput = new Input(input.name, input.expression, this.scope, this.customMath);
			this.inputs.push(newInput);
			this.inputGraph.addInput(newInput);
			this._associationInput[newInput.name] = newInput;
		})

		inputGroupJSON.rawInputs.forEach(input => {
			let newInput = new Input(input.name, input.expression, this.scope, this.customMath);
			this.rawInputs.push(newInput);
			this.inputGraph.addInput(newInput);
			this._associationInput[newInput.name] = newInput;
		})

		this.inputGraph.addEgdes();
		this.inputGraph.hasCycle();
		this.inputGraph.topologicalSort();

	}

	/**
	 *
	 *
	 */
	generateInputs() {

		for (let i = 0; i < this.numberOfInputs; i++) {
			let expression = {
				formatted: `${'collum_' + i}`
			};
			const newInput = new Input('collum_' + i, expression, this.scope, this.customMath);
			this.rawInputs.push(newInput);
			this._associationInput[newInput.name] = newInput;
		}

	}

	/**
	 *
	 *
	 * @param {*} inputConfig
	 * @return {*}
	 */
	addNewInput(inputConfig) {

		console.log('TENTANDO CRIAR NOVO INPUT');
		if (this._associationInput[inputConfig.name] !== undefined) {

			return {
				created: false,
				msg: 'Este nome já existe',
			};

		}

		const newInput = new Input(inputConfig.name, inputConfig.expression, this.scope, this.customMath);
		this._associationInput[newInput.name] = newInput;
		this.inputs.push(newInput);

		this.inputGraph.addInput(newInput);
		this.inputGraph.addEgdes();
		this.inputGraph.hasCycle();
		this.inputGraph.topologicalSort();

		window.dispatchEvent(new CustomEvent('saveCurrentDashBoard'));

		return {
			created: true,
			name: newInput.name,
			expression: newInput.expression,
		};

	}

	/**
	 *
	 *
	 * @param {*} name
	 * @return {*}
	 */
	getInputByName(name) {

		return this._associationInput[name];

	}

	/**
	 *
	 *
	 * @param {*} inputConfig
	 * @return {*}
	 */
	editInput(inputConfig) {

		console.log('TENTANDO EDITAR O INPUT');
		if (!(this._associationInput[inputConfig.newName] === undefined || inputConfig.newName === inputConfig.inputName)) {

			return {
				created: false,
				msg: 'Este nome já existe',
			};

		}

		for (let i = this.inputs.length - 1; i >= 0; i--) {
			if (this.inputs[i].name === inputConfig.inputName) {
				this.inputs.splice(i, 1);
				break;
			}
		}

		this._associationInput[inputConfig.inputName] = undefined;
		const newInput = new Input(inputConfig.newName, inputConfig.expression, this.scope, this.customMath);
		this._associationInput[newInput.newName] = newInput;
		this.inputs.push(newInput);

		this.inputGraph.addInput(newInput);
		this.inputGraph.addEgdes();
		this.inputGraph.hasCycle();
		this.inputGraph.topologicalSort();

		window.dispatchEvent(new CustomEvent('saveCurrentDashBoard'));
	}

	solve(data) {
		for (let i = 0; i < data.length; i++) {
			this.scope['collum_' + i] = data[i];
		}

		this.inputGraph.inputs.forEach(input => {
			input.evaluate();
		})

		console.log(this.scope);

		//console.log(this.scope);
		//window.dispatchEvent(new CustomEvent('dataIsProcessed'));
		//window.CurrentReader.read();
		//window.dispatchEvent(new CustomEvent('readData'));
	}

};