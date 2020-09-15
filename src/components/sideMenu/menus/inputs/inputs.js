const Menu = require('../menu');
const Components = require('../../../components.js');
const Validator = require('../../../../validator');
const Tribute = require('tributejs');
module.exports = class InputsMenu extends Menu {
	constructor() {
		super('Entradas', 'inputs_menu');
		this.customForm = Components.form();
		this.customDropDown;
	}
	attInputList() {
		window['ZenViewConfig'].currentDashBoard.inputs.forEach(input => {
			this.customDropDown.addOption(input);
		});
	}
	customInputs() {
		this.customDropDown = Components.dropDown({
			text: 'Selecione uma entrada',
			defaultText: 'Nova entrada',
			defaultValue: 'newInput',
			tests: [Validator.isFilled, Validator.noSpecialChars]
		});
		let inputName = Components.textInput({
			text: 'Tag',
			id: 'newName',
			tests: [Validator.isFilled, Validator.noSpecialChars]
		});

		let inputExpression = Components.textArea({
			text: 'Expressão',
			id: 'newDesc'
		});

		let autoComplete = new Tribute({
			noMatchTemplate: function () {
				return '<span style:"visibility: hidden;"></span>';
			},
			collection: [{
				trigger: '@',
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
							'@' + item.original.value +
							'</a>'
					);

				}
			},
			{
				trigger: '#',
				values: [{
					key: 'Phil Heartman',
					value: 'pheartman'
				},
				{
					key: 'Gordon Ramsey',
					value: 'gramsey'
				}
				],
				selectTemplate: function (item) {
					return (
						'<a contenteditable="false" class="inputTag">' +
							'#' + item.original.value +
							'</a>'
					);

				}
			}
			]
		});

		autoComplete.attach(inputExpression.input);

		this.customForm.addField(this.customDropDown);
		this.customForm.addField(inputName);
		this.customForm.addField(inputExpression);

		let spliter = Components.spliter('customInputds', 'Entradas customizáveis', this.customForm.htmlComponent, true);

		return spliter;
	}
	load() {
		let spliterContainer = document.createElement('div');
		spliterContainer.className = 'menuBody';
		spliterContainer.appendChild(this.customInputs());
		this.menuComponent.appendChild(spliterContainer);
		window.addEventListener('attInputList', () => {
			this.attInputList();
		});
	}
};