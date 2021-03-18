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


		const currentInput = window.CurrentInputGroup.inputsDictionary[inputData.name];
		const inputIndex = window.CurrentInputGroup.inputs.indexOf(currentInput);

		if (inputIndex > -1) {

			window.CurrentInputGroup.inputs.splice(inputIndex, 1);
			delete window.CurrentInputGroup.inputsDictionary[currentInput.name];

			this.inputGraph.removeNode(currentInput.name);

		}

	}

	removeRawInput() {

		const currentInput = window.CurrentInputGroup.rawInputs.pop();

		window.CurrentDashBoard.inputGroup.numberOfInputs -= 1;

		delete window.CurrentInputGroup.inputsDictionary[currentInput.name];

		this.inputGraph.removeNode(currentInput.name);

	}

	editInput(inputData) {

		
		let hasNameError = false;
		let hasExpressionError = false;
		let currentNameError;
		let currentExpressionError;
		let parsedExpression;

		if (window.CurrentInputGroup.inputsDictionary[inputData.name] && inputData.oldName !== inputData.name) {

			currentNameError = 'Esse nome já existe';
			hasNameError = true;

		}

		[hasExpressionError, currentExpressionError, parsedExpression] = this.validateExpression(inputData.expressionEntry.childNodes);


		if (!(hasNameError || hasExpressionError)) {

			const oldInput = window.CurrentInputGroup.inputsDictionary[inputData.oldName];
			this.inputGraph.removeNode(inputData.oldName);

			const finalExpression = {
				raw: inputData.expressionEntry.innerHTML,
				formatted: parsedExpression,
			};

			const newInput = new Input(inputData.name, finalExpression, this.scope);

			if (this.inputGraph.addNode(newInput)) {

				const inputIndex = window.CurrentInputGroup.inputs.indexOf(oldInput);

				delete window.CurrentInputGroup.inputsDictionary[inputData.oldName];
				window.CurrentInputGroup.inputsDictionary[inputData.name] = newInput;

				window.CurrentInputGroup.inputs[inputIndex] = newInput;

			} else {

				this.inputGraph.addNode(oldInput);
				hasExpressionError = true;
				currentExpressionError = 'Essa expressão gera um ciclo de dependências';

			};

		}

		inputData.callback({

			error: hasNameError || hasExpressionError,
			nameError: currentNameError,
			expressionError: currentExpressionError,

		});

		return hasNameError || hasExpressionError;

	}

	editRawInputName(inputData) {

		if (inputData.newName !== inputData.name) {

			if (window.CurrentInputGroup.inputsDictionary[inputData.newName]) {

				inputData.callback(true, 'Esse nome já existe');

			} else {

				window.CurrentInputGroup.inputsDictionary[inputData.newName] = window.CurrentInputGroup.inputsDictionary[inputData.name];
				delete window.CurrentInputGroup.inputsDictionary[inputData.name];
				window.CurrentInputGroup.inputsDictionary[inputData.newName].name = inputData.newName;

				this.inputGraph.nodesDictionary[inputData.newName] = this.inputGraph.nodesDictionary[inputData.name];
				delete this.inputGraph.nodesDictionary[inputData.name];
				this.inputGraph.nodesDictionary[inputData.newName].name = inputData.newName;

				this.inputGraph.CheckAndCorrectInconsistencies();
				inputData.callback(false);
				this.eventHandler.AttInputList();

			}

		}

	}

	addRawInput(inputData) {

		window.CurrentDashBoard.inputGroup.numberOfInputs += 1;

		const newInput = new Input(inputData.name, inputData.expression, this.scope);

		window.CurrentInputGroup.rawInputs.push(newInput);
		window.CurrentInputGroup.inputsDictionary[inputData.name] = newInput;

		this.inputGraph.addNode(newInput);

		this.eventHandler.AttInputList();

	}

	addNewInput(inputData) {

		let hasNameError = false;
		let hasExpressionError = false;
		let currentNameError;
		let currentExpressionError;
		let parsedExpression;

		if (window.CurrentInputGroup.inputsDictionary[inputData.name]) {

			currentNameError = 'Esse nome já existe';
			hasNameError = true;

		}

		[hasExpressionError, currentExpressionError, parsedExpression] = this.validateExpression(inputData.expressionEntry.childNodes);


		if (!(hasNameError || hasExpressionError)) {

			const finalExpression = {
				raw: inputData.expressionEntry.innerHTML,
				formatted: parsedExpression,
			};

			const newInput = new Input(inputData.name, finalExpression, this.scope);

			if (this.inputGraph.addNode(newInput)) {

				window.CurrentInputGroup.inputs.push(newInput);
				window.CurrentInputGroup.inputsDictionary[inputData.name] = newInput;

			} else {

				hasExpressionError = true;
				currentExpressionError = 'Essa expressão gera um ciclo de dependências';

			};

		}

		inputData.callback({

			error: hasNameError || hasExpressionError,
			nameError: currentNameError,
			expressionError: currentExpressionError,

		});

		return hasNameError || hasExpressionError;

	}

	validateExpression(expressionEntry) {

		let expression = '';
		const validVariables = [];

		expressionEntry.forEach((element) => {

			if (element.tagName === 'A') {

				validVariables.push(element.innerText);
				expression += element.innerText.replace('${', '').replace('#{', '').replace('}', '');

			} else {

				expression += element.data;

			}

		});

		expression = expression.replace(/\u00a0/g, ' ');
		let parsedExpression;

		try {

			parsedExpression = Math.parse(expression);


		} catch (error) {

			return [true, 'Expressão matemática inválida'];

		}

		const dependencies = parsedExpression.filter((node) => {

			return node.isSymbolNode;

		});

		for (let i = 0, j = dependencies.length; i < j; i++) {

			if (!(validVariables.includes('${' + dependencies[i] + '}') || validVariables.includes('#{' + dependencies[i] + '}'))) {

				console.warn('ERRO, NÃO FOI POSSÍVEL ENCONTRAR: ' + '${' + dependencies[i] + '}');
				return [true, 'Dependencias inválidas'];

			}

		}

		return [false, undefined, expression];

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

			this.scope[window.CurrentInputGroup.rawInputs[i].name] = Number(data[i]) ;

		}

		for (let i = window.CurrentInputGroup.numberOfInputs; i < this.inputGraph.nodes.length; i++) {

			this.inputGraph.nodes[i].input.evaluate();

		}
		
		console.log(this.scope);

		this.eventHandler.DataIsProcessed(this.scope);

	}

};