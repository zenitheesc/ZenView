const Input = require('./input');
const InputGraph = require('./inputGraph');

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
		this._associationInput = {};
		this.scope = {};
		this.inputGraph = new InputGraph();
		if (isFromJson) {

			this.constructFromJson(numberOfInputs);

		} else {

			this.newConstructor(numberOfInputs);

		}
		this.initGraph()
	}

	initGraph() {
		this.rawInputs.forEach((input) => {
			input.nextInputs = [];
			this.inputGraph.addInput(input);
		})

		this.inputs.forEach((input) => {
			input.nextInputs = [];
			this.inputGraph.addInput(input);
		})

		this.inputGraph.addEgdes();
		this.inputGraph.hasCycle();
		this.inputGraph.topologicalSort();
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
		this.rawInputs = inputGroupJSON.rawInputs;
		this.inputs = inputGroupJSON.inputs;
		this._associationInput = inputGroupJSON._associationInput;

	}

	/**
	 *
	 *
	 */
	generateInputs() {

		for (let i = 0; i < this.numberOfInputs; i++) {

			const newInput = new Input('collum_' + i, 1, this.scope);
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

		const newInput = new Input(inputConfig.name, inputConfig.expression, this.scope);
		this._associationInput[newInput.name] = newInput;
		this.inputs.push(newInput);


		newInput.visited = -1;
		console.log(this.inputGraph.nodes);
		this.inputGraph.addInput(newInput);
		this.inputGraph.addEgdes();
		this.inputGraph.hasCycle();
		this.inputGraph.topologicalSort();
		console.log(this.inputGraph.nodes);
		//fs.writeFileSync(window.CurrentDashBoard.path, JSON.stringify(window.CurrentDashBoard, null, '\t'));
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
		const newInput = new Input(inputConfig.newName, inputConfig.expression, this.scope);
		this._associationInput[newInput.newName] = newInput;
		this.inputs.push(newInput);

		newInput.visited = -1;


		this.inputGraph.addInput(newInput);
		this.inputGraph.addEgdes();
		this.inputGraph.hasCycle();
		this.inputGraph.topologicalSort();
		console.log(this.inputGraph.nodes);
		//fs.writeFileSync(window.CurrentDashBoard.path, JSON.stringify(window.CurrentDashBoard, null, '\t'));
	}

};