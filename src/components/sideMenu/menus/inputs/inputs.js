const Menu = require('../menu');
const Form = require('../../../../formBuilder').Form;
const Components = require('../../../components');
const Container = require('../../../../formBuilder').Container;
const Field = require('../../../../formBuilder').Field;
const Validator = require('../../../../validator');
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
				Directory: Field.text({
					label: 'Tag',
					att: 'inputName',
					validators: [Validator.isFilled]
				}),
				Description: Field.editableDiv({
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
	}
	attInputList() {
		this.selectInput.setOptions(window.CurrentDashBoard.inputGroup.inputs);
	}
	setFormConfigs() {
		this.selectInput.addOption({
			text: 'teste',
			value: '1'
		});
	}
	setEvents() {
		window.addEventListener('attInputList', () => {
			this.attInputList();
		});
	}
	load() {
		this.menuComponent.appendChild(this.form.htmlComponent);
		this.setFormConfigs();
		this.setEvents();
	}
};