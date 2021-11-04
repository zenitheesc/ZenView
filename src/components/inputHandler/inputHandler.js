const EventHandler = require('../eventHandler/eventHandler');
const InputGraph = require('./inputGraph');
const Input = require('../../classes/input');
const Math = require('mathjs');

module.exports = class InputHandler {

	constructor() {

		this.eventHandler = new EventHandler();
		this.inputGraph = new InputGraph();
		this.scope = {};

	}

	initInputs() {

		this.scope = window.CurrentInputGroup.scope;

		this.inputGraph = new InputGraph();

		this.inputGraph.initGraph();

		window.CurrentInputGraph = this.inputGraph;

	}

	removeInput(inputData) {


		const currentInput = window.CurrentInputGroup.inputsDictionary[inputData.uuid];
		const inputIndex = window.CurrentInputGroup.inputs.indexOf(currentInput);

		if (inputIndex > -1) {

			window.CurrentInputGroup.inputs.splice(inputIndex, 1);
			delete window.CurrentInputGroup.inputsDictionary[currentInput.uuid];

			this.inputGraph.removeNode(currentInput.uuid);

		}

	}

	removeRawInput() {

		const currentInput = window.CurrentInputGroup.rawInputs.pop();

		window.CurrentDashBoard.inputGroup.numberOfInputs -= 1;

		delete window.CurrentInputGroup.inputsDictionary[currentInput.uuid];

		this.inputGraph.removeNode(currentInput.uuid);

	}

	editInput(inputData) {

		
		let hasExpressionError = false;
		let currentExpressionError;
		let parsedExpression;

		[hasExpressionError, currentExpressionError, parsedExpression] = this.validateExpression(inputData.expressionEntry.childNodes);


		if (!hasExpressionError) {

			const oldInput = window.CurrentInputGroup.inputsDictionary[inputData.uuid];
			this.inputGraph.removeNode(inputData.uuid);

			const finalExpression = {
				raw: inputData.expressionEntry.innerHTML,
				formatted: parsedExpression,
			};

			const newInput = new Input(inputData.name, finalExpression, this.scope);

			if (this.inputGraph.addNode(newInput)) {

				const inputIndex = window.CurrentInputGroup.inputs.indexOf(oldInput);

				delete window.CurrentInputGroup.inputsDictionary[inputData.uuid];
				window.CurrentInputGroup.inputsDictionary[inputData.uuid] = newInput;

				window.CurrentInputGroup.inputs[inputIndex] = newInput;

			} else {

				this.inputGraph.addNode(oldInput);
				hasExpressionError = true;
				currentExpressionError = 'Essa expressão gera um ciclo de dependências';

			};

		}

		inputData.callback({

			error: hasExpressionError,
			expressionError: currentExpressionError,

		});

		return hasExpressionError;

	}

	editRawInputName(inputData) {

		if (inputData.newName !== inputData.name) {

			window.CurrentInputGroup.inputsDictionary[inputData.uuid].name = inputData.newName;
			
			this.inputGraph.CheckAndCorrectInconsistencies();
			inputData.callback(false);
			this.eventHandler.AttInputList();

		}

	}

	addRawInput(inputData) {

		window.CurrentDashBoard.inputGroup.numberOfInputs += 1;

		const newInput = new Input(inputData.name, inputData.expression, this.scope);

		window.CurrentInputGroup.rawInputs.push(newInput);
		window.CurrentInputGroup.inputsDictionary[inputData.uuid] = newInput;

		this.inputGraph.addNode(newInput);

		this.eventHandler.AttInputList();

	}

	addNewInput(inputData) {

		let [hasExpressionError,
            currentExpressionError,
            parsedExpression,
            readbleExpression] = this.validateExpression(inputData.expressionEntry.childNodes);


		if (!hasExpressionError) {

			const finalExpression = {
				raw: inputData.expressionEntry.innerHTML,
				formatted: parsedExpression,
				readble: readbleExpression,
			};

			const newInput = new Input(inputData.name, finalExpression, this.scope);

			if (this.inputGraph.addNode(newInput)) {

				window.CurrentInputGroup.inputs.push(newInput);
				window.CurrentInputGroup.inputsDictionary[newInput.uuid] = newInput;

			} else {

				hasExpressionError = true;
				currentExpressionError = 'Essa expressão gera um ciclo de dependências';

			};

		}

		inputData.callback({

			error: hasExpressionError,
			expressionError: currentExpressionError,

		});

		return hasExpressionError;

	}

	validateExpression(expressionEntry) {

		let expression = '';
		let readbleExpression = '';
		const validVariables = [];

		expressionEntry.forEach((element) => {

			if (element.tagName === 'A') {

				validVariables.push(element.innerText.replace('${', '').replace('#{', '').replace('}', ''));
				expression += element.id;
				readbleExpression += element.innerText.replace('${', '').replace('#{', '').replace('}', '');

			} else {

				expression += element.data;
				readbleExpression += element.data;

			}

		});

		expression = expression.replace(/\u00a0/g, ' ');
		readbleExpression = readbleExpression.replace(/\u00a0/g, ' ');
		let parsedExpression;

		try {

			parsedExpression = Math.parse(readbleExpression);


		} catch (error) {

			return [true, 'Expressão matemática inválida'];

		}

		let dependencies = parsedExpression.filter((node) => {

			return node.isSymbolNode;

		});

		dependencies = dependencies.map((value) => value.name);

		validVariables.forEach( (validInput) => {

			const index = dependencies.indexOf(validInput);
			if (index !== -1) {

				dependencies.splice(index, 1);
            
            }

		} );

		if (dependencies.length > 0) {

			console.warn('ERRO, NÃO FOI POSSÍVEL ENCONTRAR ESSAS DEPENDENCIAS: ', dependencies);
			return [true, 'Dependencias inválidas'];
		
}

		return [false, undefined, expression, readbleExpression];

	}

	build() {

		this.eventHandler.addEventListener('NewInput', (inputData) => {

			if (inputData.type === 'raw') {

				this.addRawInput(inputData);

			} else {

				this.addNewInput(inputData);

			}

		});

		this.eventHandler.addEventListener('RemoveInput', (inputData) => {

			if (inputData.type === 'raw') {

				this.removeRawInput(inputData);

			} else {

				this.removeInput(inputData);

			}

			this.eventHandler.AttInputList();

		});

		this.eventHandler.addEventListener('EditInput', (inputData) => {

			if (inputData.type === 'raw') {

				this.editRawInputName(inputData);

			} else {

				this.editInput(inputData);

			}

			this.eventHandler.AttInputList();

		});

		this.eventHandler.addEventListener('InitInputs', () => {

			this.initInputs();

		});

		window.addEventListener('DataIsReady', (evt) => {

			this.solve(evt.detail);

		});

	}

	solve(data) {

		for (let i = 0; i < window.CurrentInputGroup.numberOfInputs; i++) {

			this.scope[window.CurrentInputGroup.rawInputs[i].uuid] = Number(data[i]);

		}

		for (let i = window.CurrentInputGroup.numberOfInputs; i < this.inputGraph.nodes.length; i++) {

			this.inputGraph.nodes[i].input.evaluate();

		}
		
		this.eventHandler.DataIsProcessed(this.scope);

	}

};
