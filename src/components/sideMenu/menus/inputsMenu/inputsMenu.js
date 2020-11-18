const {Form, Container, Field} = require('../../../formBuilder/formBuilder');
const Components = require('../../../components');
const EventHandler = require('../../../eventHandler/eventHandler');
const Validator = require('../../../formBuilder/validator');
const Menu = require('../menu');
const InputCard = require('./inputsCard');
const RawInputsList = require('./rawInputsList');
const Tribute = require('tributejs');
const Math = require('mathjs');

module.exports = class InputsMenu extends Menu {

	constructor() {

		super('Entradas', 'inputs_menu');

		this.button = Field.button({
			text: 'Salvar',
			classList: ['formCenteredBtn', 'green-btn'],
		});

		this.entryInput = new Form({
			newDashboardSpliter: Container.spliter({
				name: Field.text({
					label: 'Tag',
					att: 'name',
					validators: [Validator.isFilled],
				}),
				expression: Field.editableDiv({
					label: 'Expressão',
					att: 'expression',
					validators: [Validator.isFilled],
				}),
				Save: this.button,
			}, {
				startOpen: true,
				text: 'Edição de entradas',
				id: 'inputEditingSpliter',
			}),
		}, {
			att: 'inputData',
		});

		this.rawInputList = new RawInputsList();
		this.eventHandler = new EventHandler();
		this.editMode = false;
		this.tribute;

		this.inputList = document.createElement('div');

	}

	inputListSpliter(id, name, container) {

		const spliter = Components.spliter(id, name, container, true);
		this.menuComponent.appendChild(spliter);

	}

	attInputList() {

		this.tribute.append(1, window.CurrentInputGroup.rawInputs, true);
		this.tribute.append(0, window.CurrentInputGroup.inputs, true);

		this.inputList.innerHTML = '';
		const currentInputGroup = window.CurrentInputGroup.inputs;

		currentInputGroup.forEach((input) => {

			this.inputList.appendChild((new InputCard(input.name, input.expression.formatted, input.expression.raw)).htmlComponent);

		});

	}

	validateExpression() {

		let expression = '';
		const validVariables = [];

		this.entryInput.fields[1].input.childNodes.forEach((element) => {

			if (element.tagName === 'A') {

				validVariables.push(element.innerText);
				expression += element.innerText.replace('${', '').replace('#{', '').replace('}', '');

			} else {

				expression += element.data;

			}

		});
		expression = expression.replace(/\u00a0/g, ' ');

		try {

			const parsedExpression = Math.parse(expression);
			const dependencies = parsedExpression.filter((node) => {

				return node.isSymbolNode;

			});

			for (let i = 0, j = dependencies.length; i < j; i++) {

				if (!(validVariables.includes('${' + dependencies[i] + '}') || validVariables.includes('#{' + dependencies[i] + '}'))) {

					console.warn('ERRO, NÃO FOI POSSÍVEL ENCONTRAR: ' + '${' + dependencies[i] + '}');
					return {
						valid: false,
						msg: 'Expressão matemática inválida',
					};

				}

			}

		} catch (error) {

			console.warn('ERRO, EXPRESSÃO INVÁLIDA: ' + expression);
			return {
				valid: false,
				msg: 'Expressão matemática inválida',
			};

		}


		return {
			valid: true,
			expression: expression,
		};

	}

	newInput() {

		if (!this.entryInput.validate()) return;

		const data = this.entryInput.getData().inputData;

		const expressionAnswer = this.validateExpression();

		if (!expressionAnswer.valid) {

			this.entryInput.fields[1].showWarning(expressionAnswer.msg);
			return;

		} else {

			data.expression = {};
			data.expression.formatted = expressionAnswer.expression;
			data.expression.raw = this.entryInput.fields[1].input.innerHTML;

		}

		const createdAnswer = window.CurrentInputGroup.addNewInput(data, 'entry');

		if (createdAnswer.created) {

			this.attInputList();
			this.cleanInputEntry();

		} else {

			this.entryInput.formThree.newDashboardSpliter.name.showWarning(createdAnswer.msg);

		}

	} 	

	setFormConfigs() {

		this.button.onclick = () => {

			if (!this.editMode){
				
				this.newInput();

			} else {

				this.button.htmlComponent.textContent = 'Salvar';

				// TODO: Fazer a edição de fato
				
				this.cleanInputEntry();
				this.editMode = false;

			}

		};

	}

	setAutoCompleteConfigs() {

		this.tribute = new Tribute({
			replaceTextSuffix: '',
			noMatchTemplate: function() {

				return '<span style:"visibility: hidden;"></span>';

			},
			collection: [{
				trigger: '${',
				values: [],
				lookup: (input) => {

					return input.name;

				},
				selectTemplate: function(item) {

					return (
						'<a contenteditable="false" class="inputTag">' +
							'${' + item.original.name + '}' +
							'</a>'
					);

				},
			},
			{
				trigger: '#{',
				lookup: (input) => {

					return input.name;

				},
				values: [],
				selectTemplate: function(item) {

					return (
						'<a contenteditable="false" class="inputTag">' +
							'#{' + item.original.name + '}' +
							'</a>'
					);

				},
			},
			],
		});
		this.tribute.attach(this.entryInput.formThree.newDashboardSpliter.expression.input);

	}

	setEditMode(currentName, currentExp) {
		
		this.button.htmlComponent.textContent = 'Editar entrada';
		this.entryInput.fields[0].value = currentName;
		this.entryInput.fields[1].value = currentExp;
		
		this.editMode = true;

	}

	cleanInputEntry() {

		this.entryInput.fields[0].value = '';
		this.entryInput.fields[1].value = '';

	}

	appendTag(tag) {

		this.entryInput.formThree.newDashboardSpliter.expression.input.appendChild(tag);

	}

	load() {

		this.rawInputList.build();

		this.menuComponent.appendChild(this.entryInput.htmlComponent);
		this.menuComponent.appendChild(this.rawInputList.rawInputList.htmlComponent);

		this.setFormConfigs();
		this.setAutoCompleteConfigs();

		this.inputListSpliter('inputSpliter', 'Entradas Salvas', this.inputList);

		this.eventHandler.addEventListener('AttInputList', () => {

			this.attInputList();

		});

		this.eventHandler.addEventListener('AppendTag', (e) => {

			this.appendTag(e.tag);

		});

		this.eventHandler.addEventListener('SetEditInputMode', (e) => {

			this.setEditMode(e.name, e.exp);

		});

	}

};