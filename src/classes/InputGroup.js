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
		this._associationInput = {};
		this.scope = {};
		if (isFromJson) {

			this.constructFromJson(numberOfInputs);

		} else {

			this.newConstructor(numberOfInputs);

		}

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

		/* for (let i = this.inputs.length - 1; i >= 0; i--) {
			if (this.inputs[i].name === inputConfig.inputName) {
				this.inputs.splice(i, 1);
				break;
			}
		}*/

		const currentInput = this._associationInput[inputConfig.inputName];
		const oldExpression = currentInput.expression;
		currentInput.expression = inputConfig.expression;

		if (currentInput.dependencies.includes(inputConfig.inputName)) {

			return {
				created: false,
				msg: 'Uma entrada não pode depender de si mesma',
			};

		}


		/*this._associationInput[newInput.name] = newInput;
		this.inputs.push(newInput);*/
		try {

			this.defineLevels();

		} catch (error) {

			console.log(error);
			return {
				created: false,
				msg: 'Esta expressão gera um ciclo de dependencias',
			};

		}

		currentInput.visited = -1;

		return {
			created: true,
			name: newInput.name,
			expression: newInput.expression,
		};

	}

	/**
	 *
	 *
	 */
	resetBusca() {

		this.inputs.forEach((input) => {

			input.visited = -1;

		});

	}

	/**
	 *
	 *
	 * @param {*} input
	 * @param {*} currentPos
	 * @return {*}
	 */
	topologicRecursion(input, currentPos) {

		if (input.visited === 0) {

			throw new Error('Ciclo E1ncontrado');

		}

		input.visited = 0;

		if (input.level === undefined || input.level < currentPos) {

			input.level = currentPos;
			input.nextInputs.forEach((nextInput) => {

				this.recursion(nextInput, currentPos + 1);

			});

		}

		input.visited = 1;
		return true;

	}

	/**
	 *
	 *
	 * @return {*}
	 */
	defineLevels() {

		this.rawInputs.forEach(
			(input) => {

				if (input.dependencies.length === 0) {

					this.resetBusca();
					this.topologicRecursion(input, 0);

				}

			});

		this.inputs.forEach(
			(input) => {

				if (input.dependencies.length === 0) {

					this.resetBusca();
					this.topologicRecursion(input, 0);

				}

			});

		return true;

	}

	/**
	 *
	 *
	 * @return {*}
	 */
	topologicalSort() {

		this.inputs.sort((input1, input2) => {

			return input1.level - input2.level;

		});

		return this.inputs;

	}

};