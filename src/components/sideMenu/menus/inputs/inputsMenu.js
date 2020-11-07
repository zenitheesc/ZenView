const {Form, Container, Field} = require('../../../formBuilder/formBuilder');
const Components = require('../../../components');
const EventHandler = require('../../../eventHandler/eventHandler');
const Validator = require('../../../formBuilder/validator');
const Menu = require('../menu');
const RawInputCard = require('./rawInputsCards');
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

        this.eventHandler = new EventHandler();
        this.tribute;

        this.inputList = document.createElement("div");
        this.rawInputList = document.createElement("ul");
        this.rawInputList.id = "rawInputList";

    }  

    inputListSpliter(id, name, container) {

        const spliter = Components.spliter(id, name, container, true);
		this.menuComponent.appendChild(spliter);
    
    }

    rawInputsButtons() {

		let rawInputsButtonDiv = document.createElement("div");
		const currentInputGroup = window.CurrentInputGroup;

        let addButton = Field.button({
			text: 'Adicionar',
			classList: ['col-5', 'green-btn', 'rawInputsButton'],
        }).htmlComponent;

        let delButton = Field.button({
			text: 'Deletar',
			classList: ['col-5', 'red-btn', 'rawInputsButton'],
        }).htmlComponent;

		addButton.addEventListener('click', () => {

			window.CurrentDashBoard.inputGroup.numberOfInputs += 1;
			
			let i = window.CurrentDashBoard.inputGroup.numberOfInputs - 1;
			let customMath = window.CurrentDashBoard.inputGroup.customMath;

			const expression = {
				formatted: `${'collum_' + i}`,
			};

			let newInput = new Input('collum_' + i, expression, window.scope, customMath);

			currentInputGroup.addNewInput(newInput, "raw");

			this.attRawInputList();

		});

		
		delButton.addEventListener('click', () => {

			
			
		});

        rawInputsButtonDiv.id = "rawInputsButtons";
        rawInputsButtonDiv.className = "row";

        rawInputsButtonDiv.appendChild(addButton);
        rawInputsButtonDiv.appendChild(delButton);

        this.rawInputList.appendChild(rawInputsButtonDiv);

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
        this.rawInputList.innerHTML = '';
		const currentInputGroup = window.CurrentInputGroup.rawInputs;

		currentInputGroup.forEach((input) => {

			this.rawInputList.appendChild((new RawInputCard(input.name, this.entryInput)).htmlComponent);

        });
        
        this.rawInputsButtons();
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

        this.setFormConfigs();
        this.setAutoCompleteConfigs();

        this.inputListSpliter('rawInputSpliter', 'Dados Recebidos', this.rawInputList);
        this.inputListSpliter('inputSpliter', 'Entradas Salvas', this.inputList);

        this.eventHandler.addEventListener('AttInputList', () => {

            this.attRawInputList();
			this.attInputList();

		});
    }
    
}