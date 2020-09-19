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
				content: Components.icon('trash'),
				classList: ['formButtonWithIconPrepend']
			}, {
				type: 'button',
				content: Components.icon('plus-square'),
				classList: ['formButtonWithIconPrepend']
			}]
		});
		this.form = new Form({
			newDashBoardSpliter: Container.spliter({
				selectedInput: this.selectInput,
				inputName: Field.text({
					label: 'Tag',
					att: 'inputName',
					validators: [Validator.isFilled]
				}),
				expression: Field.editableDiv({
					label: 'Expressão',
					att: 'expression',
				}),
				Save: this.button
			}, {
				startOpen: true,
				text: 'Edição de entradas',
				id: 'inputEditingSpliter'
			})
		});
		this.tribute;
	}
	attInputList() {
		console.log(window.CurrentInputGroup.rawInputs);
		this.tribute.append(1,window.CurrentInputGroup.rawInputs,true);
		this.tribute.append(0,window.CurrentInputGroup.inputs,true);
		this.selectInput.setOptions(window.CurrentDashBoard.inputGroup.inputs, (value) => {
			return value.name;
		});
	}
	setFormConfigs() {
		this.selectInput.addOption({
			text: 'teste',
			value: '1'
		});
	}
	setAutoCompleteConfigs() {
		this.tribute = new Tribute({
			noMatchTemplate: function () {
				return '<span style:"visibility: hidden;"></span>';
			},
			collection: [
				{
					trigger: '$',
					values: [{
							key: 'Phil Heartman',
							value: 'pheartman'
						},
						{
							key: 'Gordon Ramsey',
							value: 'gramsey'
						},

					],
					selectTemplate: function (item) {
						return (
							'<a contenteditable="false" class="inputTag">' +
							item.original.value +
							'</a>'
						);

					}
				},
				{
					trigger: '#',
					lookup: (input,mentionText)=>{
						return input.name;
					},
					values: [],
					selectTemplate: function (item) {
						return (
							'<a contenteditable="false" class="inputTag">' +
							'#' + item.original.name +
							'</a>'
						);

					}
				}
			]
		});
		this.tribute.attach(this.form.formThree.newDashBoardSpliter.expression.input);
	}
	setEvents() {
		window.addEventListener('attInputList', () => {
			this.attInputList();
		});
	}
	load() {
		this.menuComponent.appendChild(this.form.htmlComponent);
		this.setFormConfigs();
		this.setAutoCompleteConfigs();
		this.setEvents();
	}
};