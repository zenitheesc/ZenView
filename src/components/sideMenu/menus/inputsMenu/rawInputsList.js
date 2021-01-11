const { Form, Container, Field } = require('../../../formBuilder/formBuilder');
const Validator = require('../../../formBuilder/validator');
const Components = require('../../../components');
const EventHandler = require('../../../eventHandler/eventHandler');

module.exports = class RawInputsList {

	constructor() {

		this.addButton = Field.button({
			text: 'Adicionar nova coluna',
			classList: ['green-btn', 'formCenteredBtn', 'rawInputsButton'],
		});

		this.delButton = Field.button({
			text: 'Deletar última coluna',
			classList: ['red-btn', 'formCenteredBtn', 'rawInputsButton'],
		});

		this.rawInputSelector = Field.select({
			label: 'Dados Recebidos',
			att: 'currentRawInput',
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

			this.rawInputList = new Form({
				newDashboardSpliter: Container.spliter({
					rawInput: this.rawInputSelector,
					editField: this.editField,
					rawInputsAddButton: this.addButton,
					rawInputsDelButton: this.delButton,
				}, {
					startOpen: true,
					text: 'Dados Recebidos',
					id: 'rawInputSpliter',
				},
				),
			});

		this.eventHandler = new EventHandler();
		this.currentInputName;

	}

	attRawInputList() {

		const currentInputGroup = window.CurrentInputGroup.rawInputs;

		this.rawInputSelector.setOptions(currentInputGroup, (value) => {

			return [value.name, value.name];

		});

	}

	setFormConfigs() {

		this.rawInputSelector.append[0].onclick = () => {

			const tag = document.createElement('a');
			tag.contentEditable = 'false';
			tag.className = 'inputTag';
			tag.textContent = '#{' + this.rawInputSelector.value + '}';

			this.eventHandler.dispatchEvent('AppendTag', { tag: tag });

		};

		this.rawInputSelector.append[1].onclick = () => {

			this.editField.htmlComponent.classList.remove('d-none');
			this.editField.value = this.rawInputSelector.value;
			this.currentInputName = this.rawInputSelector.value;

		};

		this.editField.append[0].onclick = () => {

			if (!this.rawInputList.validate()) return;

			this.eventHandler.EditInput({
				name: this.currentInputName,
				newName: this.editField.value,
				type: 'raw',
				callback: (error, msg) => {

					if (error) {

						this.editField.showWarning(msg);

					} else {

						this.editField.htmlComponent.classList.add('d-none');
						this.editField.value = '';

					}

				},
			});
			

		};

		this.addButton.onclick = () => {

			const i = window.CurrentDashBoard.inputGroup.numberOfInputs;

			this.eventHandler.NewInput({
				name: 'collum_' + i,
				type: 'raw',
				expression: {
					formatted: `${'collum_' + i}`,
				},
			});

		};

		this.delButton.onclick = () => {

			this.eventHandler.RemoveInput({
				name: this.rawInputSelector.value,
				type: 'raw',
			});

		};

	}

	build() {

		this.editField.htmlComponent.classList.add('d-none');

		this.setFormConfigs();

		this.eventHandler.addEventListener('AttInputList', () => {

			this.attRawInputList();

		});

	}

};