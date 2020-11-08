const {Form, Container, Field} = require('../../../formBuilder/formBuilder');
const Components = require('../../../components');
const EventHandler = require('../../../eventHandler/eventHandler');
const Validator = require('../../../formBuilder/validator');
const Menu = require('../menu');
const InputCard = require('./inputsCard');
const Input = require('../../../../classes/input');
const Tribute = require('tributejs');
const Math = require('mathjs');

module.exports = class InputsMenu extends Menu {

    constructor() {

        super("Entradas", "inputs_menu");

        this.button = Field.button({
			text: 'Salvar',
			classList: ['formCenteredBtn', 'green-btn'],
		});
		
		this.addButton = Field.button({
			text: 'Adicionar nova coluna',
			classList: ['green-btn', 'formCenteredBtn', 'rawInputsButton'],
        });

        this.delButton = Field.button({
			text: 'Deletar última coluna',
			classList: ['red-btn', 'formCenteredBtn', 'rawInputsButton'],
        });

		this.rawInputSelector = Field.select({
			label:"Dados Recebidos",
			att: "currentRawInput",
			append: [{
				type: 'button',
				content: Components.icon('plus-square'),
				classList: ['formButtonWithIconPrepend'],
			}, {
				type: 'button',
				content: Components.icon('pencil-square'),
				classList: ['formButtonWithIconPrepend'],
			}],
		});

		this.editField = Field.text({
			label: 'Novo nome',
			att: 'editField',
			validators: [Validator.isFilled],
			append: [{
				type: 'button',
				content: Components.icon('save'),
				classList: ['formButtonWithIconPrepend'],
			}],
		}),

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
        },{
			att: 'inputData',
		});

		this.rawInputList = new Form({
			newDashboardSpliter: Container.spliter({
				rawInput: this.rawInputSelector,
				rawInputsAddButton: this.addButton,
				rawInputsDelButton: this.delButton,
			},{
				startOpen: true,
				text: 'Dados Recebidos',
				id: 'rawInputSpliter',	
			}
		),
		});

        this.eventHandler = new EventHandler();
		this.tribute;
		this.editMode = false;

        this.inputList = document.createElement("div");

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

			this.inputList.appendChild((new InputCard(input.name, input.expression.formatted, this.entryInput)).htmlComponent);

		});

    }
    
    attRawInputList() {

		const currentInputGroup = window.CurrentInputGroup.rawInputs;

		this.rawInputSelector.setOptions(currentInputGroup, (value) => {

			return [value.name, value.name];

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

		const createdAnswer = window.CurrentInputGroup.addNewInput(data, "entry");

		if (createdAnswer.created) {

			this.attInputList();
			this.cleanInputEntry();

		} else {

			this.entryInput.formThree.newDashboardSpliter.name.showWarning(createdAnswer.msg);

		}

    }
    
    setFormConfigs() {

        this.button.onclick = () => {

			this.newInput();

		};

		this.rawInputSelector.append[0].onclick = () => {

			let tag = document.createElement("a");
			tag.contentEditable = "false";
			tag.className = "inputTag";
			tag.textContent = '#{' + this.rawInputSelector.value + '}';

			this.entryInput.formThree.newDashboardSpliter.expression.input.appendChild(tag);

		};

		this.rawInputSelector.append[1].onclick = () => {

		};

		this.addButton.onclick = () => {

			window.CurrentDashBoard.inputGroup.numberOfInputs += 1;
			
			let i = window.CurrentDashBoard.inputGroup.numberOfInputs - 1;
			let customMath = window.CurrentDashBoard.inputGroup.customMath;

			const expression = {
				formatted: `${'collum_' + i}`,
			};

			let newInput = new Input('collum_' + i, expression, window.scope, customMath);

			window.CurrentInputGroup.addNewInput(newInput, "raw");

			this.attRawInputList();

		};
		
		this.delButton.onclick = () => {

			window.CurrentDashBoard.inputGroup.numberOfInputs -= 1;
			window.CurrentInputGroup.delInput("raw");

			this.attRawInputList();
			
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

    cleanInputEntry() {

        this.entryInput.fields[0].value = '';
        this.entryInput.fields[1].value = '';
	
	}

    load() {

		this.menuComponent.appendChild(this.entryInput.htmlComponent);
		this.menuComponent.appendChild(this.rawInputList.htmlComponent);

        this.setFormConfigs();
		this.setAutoCompleteConfigs();
		
        this.inputListSpliter('inputSpliter', 'Entradas Salvas', this.inputList);

        this.eventHandler.addEventListener('AttInputList', () => {

			this.attRawInputList();
			this.attInputList();

		});
    }
    
}