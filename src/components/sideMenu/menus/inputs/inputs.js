const Menu = require('../menu');
const Form = require('../../../../formBuilder').Form;
const Components = require('../../../components');
const Container = require('../../../../formBuilder').Container;
const Field = require('../../../../formBuilder').Field;
const Validator = require('../../../../validator');
const Tribute = require('tributejs');
module.exports = class InputsMenu extends Menu {
	constructor() {
		super('Entradas', 'inputs_menu');
		this.button = Field.button({
			text: 'Salvar',
			classList: ['formCenteredBtn', 'green-btn']
		});
		this.selectInput = Field.select({
			label: 'Nome',
			att: 'currentInput',
			append: [{
				type: 'button',
				content: Components.icon('plus-square'),
				classList: ['formButtonWithIconPrepend']
			}, {
				type: 'button',
				content: Components.icon('trash'),
				classList: ['formButtonWithIconPrepend']
			}]
		});
		this.form = new Form({
			newDashBoardSpliter: Container.spliter({
				selectedInput: this.selectInput,
				name: Field.text({
					label: 'Tag',
					att: 'name',
					validators: [Validator.isFilled]
				}),
				expression: Field.editableDiv({
					label: 'Expressão',
					att: 'expression',
					validators: [Validator.isFilled]
				}),
				Save: this.button
			}, {
				startOpen: true,
				text: 'Edição de entradas',
				id: 'inputEditingSpliter'
			})
		}, {
			att: 'inputData'
		});
		this.tribute;
	}
	attInputList() {
		console.warn(window.CurrentInputGroup.rawInputs);
		console.warn(window.CurrentInputGroup.inputs);
		this.tribute.append(1, window.CurrentInputGroup.rawInputs, true);
		this.tribute.append(0, window.CurrentInputGroup.inputs, true);
		this.selectInput.setOptions(window.CurrentInputGroup.inputs, (value) => {
			return [value.name,value.name];
		});
	}
	newInput() {
		if (this.form.validate()) {
			let answer = window.CurrentInputGroup.addNewInput(this.form.getData().inputData);
			console.log(answer);
			if(answer.created){
				this.attInputList();
			}else{
				if(answer.error == 1){
					this.form.formThree.newDashBoardSpliter.name.showWarning(answer.msg);
				}
			}
		}
	}
	attInput() {

	}
	setFormConfigs() {
		this.selectInput.append[0].onclick = () => {
			this.button.htmlComponent.textContent = 'Nova entrada';
			this.button.htmlComponent.removeEventListener('click');
			this.button.onclick = () => {
				this.newInput();
			};
		};

		this.selectInput.append[1].onclick = () => {
			console.log('append2');
		};

		this.selectInput.input.onchange = () => {
			this.button.htmlComponent.textContent = 'Salvar';
			this.button.htmlComponent.removeEventListener('click');
			this.button.onclick = () => {
				this.attInput();
			};
		};

		this.button.onclick = () => {
			this.newInput();
		};

		this.button.htmlComponent.textContent = 'Nova entrada';

	}
	setAutoCompleteConfigs() {
		this.tribute = new Tribute({
			noMatchTemplate: function () {
				return '<span style:"visibility: hidden;"></span>';
			},
			collection: [{
					trigger: '$',
					values: [],
					selectTemplate: function (item) {
						return (
							'<a contenteditable="false" class="inputTag">' +
							'{' + item.original.name + '}' +
							'</a>'
						);

					}
				},
				{
					trigger: '#',
					lookup: (input, mentionText) => {
						return input.name;
					},
					values: [],
					selectTemplate: function (item) {
						return (
							'<a contenteditable="false" class="inputTag">' +
							'{' + item.original.name + '}' +
							'</a>'
						);

					}
				}
			]
		});
		this.tribute.attach(this.form.formThree.newDashBoardSpliter.expression.input);
	}
	setEvents() {
		console.log('adicionando evento');
		window.addEventListener('attInputList', () => {
			console.log('evento ouvido');
			this.attInputList();
		});
	}
	load() {
		this.menuComponent.appendChild(this.form.htmlComponent);
		this.setFormConfigs();
		this.setAutoCompleteConfigs();
	}
};