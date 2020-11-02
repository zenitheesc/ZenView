const Menu = require('../menu');
const Form = require('../../../formBuilder/formBuilder').Form;
const Components = require('../../../components');
const Container = require('../../../formBuilder/formBuilder').Container;
const Field = require('../../../formBuilder/formBuilder').Field;
const Validator = require('../../../formBuilder/validator');
const Tribute = require('tributejs');
const Math = require('mathjs');

module.exports = class InputsMenu extends Menu {

	constructor() {

		super('Entradas', 'inputs_menu');

		this.button = Field.button({
			text: 'Salvar',
			classList: ['formCenteredBtn', 'green-btn'],
		});

		this.selectInput = Field.select({
			label: 'Nome',
			att: 'currentInput',
			append: [{
				type: 'button',
				content: Components.icon('plus-square'),
				classList: ['formButtonWithIconPrepend'],
			}, {
				type: 'button',
				content: Components.icon('trash'),
				classList: ['formButtonWithIconPrepend'],
			}],
		});

		this.form = new Form({
			newDashBoardSpliter: Container.spliter({
				selectedInput: this.selectInput,
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
		this.tribute;

	}

	attInputList() {

		this.tribute.append(1, window.CurrentInputGroup.rawInputs, true);
		this.tribute.append(0, window.CurrentInputGroup.inputs, true);
		this.selectInput.setOptions(window.CurrentInputGroup.inputs, (value) => {

			return [value.name, value.name];

		});

	}

	validateExpression() {

		let expression = '';
		const validVariables = [];

		this.form.fields[2].input.childNodes.forEach((element) => {

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

		if (!this.form.validate()) return;

		const data = this.form.getData().inputData;

		const expressionAnswer = this.validateExpression();

		if (!expressionAnswer.valid) {

			this.form.fields[2].showWarning(expressionAnswer.msg);
			return;

		} else {

			data.expression = {};
			data.expression.formatted = expressionAnswer.expression;
			data.expression.raw = this.form.fields[2].input.innerHTML;

		}

		const createdAnswer = window.CurrentInputGroup.addNewInput(data);

		if (createdAnswer.created) {

			this.attInputList();
			this.setEditMode();

		} else {

			this.form.formThree.newDashBoardSpliter.name.showWarning(createdAnswer.msg);

		}

	}

	setFormConfigs() {

		this.selectInput.append[0].onclick = () => {

			this.button.htmlComponent.textContent = 'Nova entrada';
			this.button.onclick = () => {

				this.newInput();

			};
			this.form.reset();

		};

		this.selectInput.append[1].onclick = () => {

			console.log('Deletar entrada');

		};

		this.selectInput.input.onchange = () => {

			this.setEditMode();

		};

		this.button.onclick = () => {

			this.newInput();

		};

		this.button.htmlComponent.textContent = 'Nova entrada';

	}

	setEditMode() {

		this.button.htmlComponent.textContent = 'Salvar';
		const input = window.CurrentInputGroup.getInputByName(this.selectInput.value);
		this.form.fields[1].value = input.name;
		this.form.fields[2].value = input.expression.raw;
		this.button.onclick = () => {

			this.attInput();

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
		this.tribute.attach(this.form.formThree.newDashBoardSpliter.expression.input);

	}

	load() {

		this.menuComponent.appendChild(this.form.htmlComponent);
		this.setFormConfigs();
		this.setAutoCompleteConfigs();

		this.EventHandler.addEventListener('AttInputList', () => {

			this.attInputList();

		});

	}

};