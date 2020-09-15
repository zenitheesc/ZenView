const fs = require('fs');
const ipc = require('electron').ipcRenderer;
const Validator = require('../validator');
module.exports = class Components {
	static spliter(id, text, content, startOpen) {
		const card = document.createElement('div');
		card.className = 'card menuSpliter';

		const cardHeader = document.createElement('div');

		cardHeader.id = id + '_header';
		cardHeader.setAttribute('data-toggle', 'collapse');
		cardHeader.setAttribute('data-target', `#menu_${id}_option`);
		cardHeader.setAttribute('aria-expanded', startOpen);
		cardHeader.setAttribute('aria-controls', `menu_${id}_option`);
		cardHeader.textContent = text;

		const cardBodyCollapse = document.createElement('div');
		cardBodyCollapse.id = `menu_${id}_option`;

		if (startOpen) {
			cardBodyCollapse.className = 'collapse show';
			cardHeader.className = 'card-header menuSpliter-header';
		} else {
			cardHeader.className = 'card-header menuSpliter-header collapsed';
			cardBodyCollapse.className = 'collapse';
		}

		cardBodyCollapse.setAttribute('aria-labelledby', `${id}_option`);

		const cardBody = document.createElement('div');
		cardBody.className = 'card-body form-group';
		cardBody.appendChild(content);
		cardBodyCollapse.appendChild(cardBody);
		cardBody.id = id + '_body';
		card.appendChild(cardHeader);
		card.appendChild(cardBodyCollapse);

		return card;
	}
	static menuHeader(text, optionsContent) {
		const menuHeaderComponent = document.createElement('div');
		const title = document.createElement('h6');
		title.textContent = text;
		menuHeaderComponent.className = 'menuHeader';

		menuHeaderComponent.appendChild(title);

		if (optionsContent != undefined) {
			const options = document.createElement('div');
			options.appendChild(optionsContent);
			menuHeaderComponent.appendChild(options);
		}

		return menuHeaderComponent;
	}
	static invalidWarning(id) {
		const errorMsg = document.createElement('div');
		errorMsg.className = 'invalid-feedback';
		errorMsg.id = id + '_invalid';
		return errorMsg;
	}
	static field(htmlComponent, inputComponent, warning, tests) {
		class FieldComponent {
			constructor(htmlComponent, inputComponent, warning, tests) {
				this.id = inputComponent.id;
				this.htmlComponent = htmlComponent;
				this.input = inputComponent;
				this.warning = warning;
				this.tests = tests || [];
				this.input.addEventListener('input', () => {
					this.hideWarning();
				});
			}
			get value() {
				return this.input.value;
			}
			showWarning(txt) {
				warning.textContent = txt;
				this.input.classList.add('is-invalid');
			}
			hideWarning() {
				this.input.classList.remove('is-invalid');
			}
			validate() {
				let isValid = true;
				for (let i = 0, j = this.tests.length; i < j; i++) {
					const response = this.tests[i](this.value);
					if (response === true) {
						this.hideWarning();
					} else {
						isValid = false;
						this.showWarning(response);
						break;
					}
				}
				return isValid;
			}
		}

		return new FieldComponent(htmlComponent, inputComponent, warning, tests);
	}
	static small(text) {
		const smallComponent = document.createElement('small');
		smallComponent.className = 'form-text text-muted';
		smallComponent.textContent = text;
		return smallComponent;
	}
	static inpuGroup(className) {
		const inputGroupComponent = document.createElement('div');
		inputGroupComponent.classList.add('input-group-sm');
		inputGroupComponent.classList.add('mb-3');
		if (className !== undefined) inputGroupComponent.classList.add(className);

		return inputGroupComponent;
	}
	static input(id, tipo) {
		const inputComponent = document.createElement('input');

		inputComponent.id = id;
		inputComponent.type = tipo;
		inputComponent.className = 'form-control';
		inputComponent.setAttribute('aria-label', 'Small');
		inputComponent.setAttribute('aria-describedby', 'inputGroup-sizing-sm');

		return inputComponent;
	}
	static textInput(textInputObj) {
		const textInputComponent = {};
		textInputComponent.htmlComponent = this.inpuGroup(textInputObj.className);

		textInputComponent.htmlComponent.appendChild(this.small(textInputObj.text));

		textInputComponent.input = this.input(textInputObj.id, 'text');

		if (textInputObj.value !== undefined) textInputComponent.input.value = textInputObj.value;

		textInputComponent.htmlComponent.appendChild(textInputComponent.input);

		textInputComponent.warning = this.invalidWarning(textInputObj.id);

		textInputComponent.htmlComponent.appendChild(textInputComponent.warning);

		return this.field(textInputComponent.htmlComponent, textInputComponent.input, textInputComponent.warning, textInputObj.tests);
	}
	static numberInput(numberInputObj) {
		const textInputGroup = this.inpuGroup();

		textInputGroup.appendChild(this.small(numberInputObj.text));

		const textInputComponent = this.input(numberInputObj.id, 'number');

		const warning = this.invalidWarning(numberInputObj.id);

		textInputGroup.appendChild(textInputComponent);

		textInputGroup.appendChild(warning);

		return this.field(textInputGroup, textInputComponent, warning, numberInputObj.tests);
	}
	static textArea(textAreaObj) {
		const textInputGroup = this.inpuGroup();

		textInputGroup.appendChild(this.small(textAreaObj.text));
		let textInputComponent = document.createElement('div');
		textInputComponent.className = 'textAreaFalse form-control';
		textInputComponent.contentEditable = false;
		textInputComponent.sandbox = 'allow-same-origin';
		textInputComponent.textContent - 'asdasd';
		textInputComponent.style.height = 'auto';
		textInputComponent.oninput = () =>{
			console.log(textInputComponent.textContent);
		}
		textInputGroup.appendChild(textInputComponent);

		const warning = this.invalidWarning(textAreaObj.id);

		textInputGroup.appendChild(warning);

		return this.field(textInputGroup, textInputComponent, warning, textAreaObj.tests);
	}
	static icon(iconName) {
		return (fs.readFileSync('./src/images/icons/' + iconName + '.svg')).toString();
	}
	static dashBoardCard(name, desc, path) {
		const dashBoardCardComponent = document.createElement('div');
		dashBoardCardComponent.setAttribute('class', 'card dashBoardCard mb-3');

		const dashBoardCardComponentHeader = document.createElement('div');
		dashBoardCardComponentHeader.setAttribute('class', 'card-header row dashBoardCard-header m-0 justify-content-between');

		const dashBoardCardComponentHeaderTitle = document.createElement('div');
		dashBoardCardComponentHeaderTitle.innerText = name;

		const dashBoardCardComponentHeaderOptions = document.createElement('div');

		dashBoardCardComponentHeader.appendChild(dashBoardCardComponentHeaderTitle);


		const playBtn = this.buttonWithIcon('play', 'dashBoardCardOption');
		const editBtn = this.buttonWithIcon('pencil-square', 'dashBoardCardOption');
		const delBtn = this.buttonWithIcon('trash', 'dashBoardCardOption');

		playBtn.addEventListener('click', () => {
			window.dispatchEvent(new CustomEvent('openDashBoard', {
				detail: {
					context: 'start',
					dashBoardPath: path,
				},
			}));
		});

		editBtn.addEventListener('click', () => {
			console.log('contexto global alterado para edição');
			window.dispatchEvent(new CustomEvent('openDashBoard', {
				detail: {
					context: 'editing',
					dashBoardPath: path,
				},
			}));
		});

		delBtn.addEventListener('click', () => {
			window.dispatchEvent(new CustomEvent('deleteDashboard', {
				detail: {
					dashBoardPath: path,
				},
			}));
		});

		dashBoardCardComponentHeaderOptions.appendChild(playBtn);
		dashBoardCardComponentHeaderOptions.appendChild(editBtn);
		dashBoardCardComponentHeaderOptions.appendChild(delBtn);

		dashBoardCardComponentHeader.appendChild(dashBoardCardComponentHeaderOptions);

		const dashBoardCardComponentBody = document.createElement('div');
		dashBoardCardComponentBody.className = 'card-body';

		const dashBoardCardComponentDesc = document.createElement('p');
		dashBoardCardComponentDesc.textContent = desc;

		const dashBoardCardComponentPath = document.createElement('cite');
		dashBoardCardComponentPath.textContent = 'PATH:' + path;

		dashBoardCardComponentBody.appendChild(dashBoardCardComponentDesc);
		dashBoardCardComponentBody.appendChild(dashBoardCardComponentPath);

		dashBoardCardComponent.appendChild(dashBoardCardComponentHeader);
		dashBoardCardComponent.appendChild(dashBoardCardComponentBody);

		return dashBoardCardComponent;
	}
	static buttonWithIcon(iconName, className) {
		const button = document.createElement('button');
		button.type = 'button';
		if (className !== undefined) button.classList.add(className);
		button.innerHTML = this.icon(iconName);
		return button;
	}
	static inputCard(id, name, expression) {
		const inputCardComponent = document.createElement('div');
		const inputCardComponentRow1 = document.createElement('div');
		const inputCardComponentRow2 = document.createElement('div');
		inputCardComponent.className = 'inputCard mb-2';

		inputCardComponentRow1.className = 'form-row';
		inputCardComponentRow2.className = 'form-row';

		const saveBtn = this.buttonWithIcon('save', 'inputCard');
		const delBtn = this.buttonWithIcon('trash', 'inputCard');

		const isNewName = (currentInput, array) => {
			array.forEach((input) => {
				console.log(currentInput, array);
				if (input.name === currentInput.value) {
					return 'Esse nome já existe';
				}
			});
			return true;
		};

		const inputArray = window['ZenViewConfig'].currentDashBoard.inputs;

		const nameInput = this.textInput({
			text: 'Nome',
			id: id + '_name',
			className: 'col-10',
			value: name,
			tests: [Validator.isFilled, Validator.noSpecialChars, () => {
				return isNewName(nameInput, inputArray);
			}],
		});

		const expressionInput = this.textInput({
			text: 'Expressão',
			id: id + '_expression',
			className: 'col-10',
			value: expression,
			tests: [Validator.isFilled],
		});

		saveBtn.onclick = () => {
			nameInput.validate();
			expressionInput.validate();
		};

		inputCardComponentRow1.appendChild(nameInput.htmlComponent);

		inputCardComponentRow2.appendChild(expressionInput.htmlComponent);

		inputCardComponentRow1.appendChild(saveBtn);
		inputCardComponentRow2.appendChild(delBtn);

		inputCardComponent.appendChild(inputCardComponentRow1);
		inputCardComponent.appendChild(inputCardComponentRow2);

		return inputCardComponent;
	}
	static pathInput(pathInputObj) {
		const pathInputGroup = document.createElement('div');

		pathInputGroup.className = 'input-group mb-3 pathInput';
		pathInputGroup.classList.add(pathInputObj.className);

		pathInputGroup.appendChild(this.small(pathInputObj.text));

		const inputConainer = document.createElement('div');
		inputConainer.className = 'input-group';
		const inputGroupPrepend = document.createElement('div');
		inputGroupPrepend.className = 'input-group-prepend';

		const inputGroupPrependButton = this.buttonWithIcon('folder2-open');

		inputGroupPrepend.appendChild(inputGroupPrependButton);

		inputConainer.appendChild(inputGroupPrepend);

		const pathInputComponent = document.createElement('input');
		pathInputComponent.disabled = true;
		pathInputComponent.id = pathInputObj.id;
		pathInputComponent.type = 'text';
		pathInputComponent.className = 'form-control';
		pathInputComponent.setAttribute('aria-describedby', 'basic-addon1');
		inputConainer.appendChild(pathInputComponent);
		inputConainer.appendChild(this.invalidWarning(pathInputObj.id));

		pathInputGroup.appendChild(inputConainer);

		const warning = this.invalidWarning(pathInputObj.id);
		inputConainer.appendChild(warning);

		inputConainer.onclick = () => {
			ipc.send('open-file-dialog-for-dir');
		};
		ipc.on('selected-dir', (evt, arg) => {
			if (arg !== '' && arg !== undefined) {
				pathInputComponent.value = arg || '';
				pathInputComponent.textContent = arg || '';
				pathInputComponent.dispatchEvent(new Event('input'));
			}
		});

		return this.field(pathInputGroup, pathInputComponent, warning, pathInputObj.tests);
	}
	static form(id) {
		const formComponent = {};
		formComponent.htmlComponent = document.createElement('form');
		if (id !== undefined) formComponent.htmlComponent.id = id;
		formComponent.fields = [];
		formComponent.components = [];

		formComponent.addField = (field) => {
			formComponent.fields.push(field);
			formComponent.htmlComponent.appendChild(field.htmlComponent);
		};

		formComponent.addComponent = (component) => {
			formComponent.components.push(component);
			formComponent.htmlComponent.appendChild(component);
		};

		formComponent.getData = () => {
			const response = {};

			formComponent.fields.forEach((field) => {
				response[field.id] = field.value;
			});
			return response;
		};

		formComponent.validate = () => {
			let response = true;
			formComponent.fields.forEach((field) => {
				if (!field.validate()) {
					response = false;
				}
			});
			return response;
		};

		formComponent.clear = () => {
			formComponent.fields.forEach((field) => {
				field.input.value = '';
			});
		};

		return formComponent;
	}
	static dropDown(dropDownObj) {
		const inputGroup = this.inpuGroup();
		const dropDownComponent = document.createElement('select');

		inputGroup.appendChild(this.small(dropDownObj.text));

		if (dropDownObj.id !== undefined) dropDownComponent.id = dropDownObj.id;
		dropDownComponent.className = 'custom-select';

		if (dropDownObj.defaultText !== undefined) {
			let newOption;
			dropDownComponent.innerHTML = '';
			newOption = document.createElement('option');
			newOption.className = 'standardOption';
			newOption.text = dropDownObj.defaultText;
			newOption.value = dropDownObj.defaultValue;
			dropDownComponent.add(newOption);
		}

		const attOptions = (options) => {
			let newOption;
			dropDownComponent.add(newOption);
			options.forEach((option) => {
				newOption = document.createElement('option');
				newOption.value = option.value || option.text || option.name;
				newOption.text = option.text || option.value || option.name;
				dropDownComponent.add(newOption);
			});
		};

		const addOption = (option) => {
			const newOption = document.createElement('option');
			newOption.value = option.value || option.text || option.name;
			newOption.text = option.text || option.value || option.name;
			dropDownComponent.add(newOption);
		};

		inputGroup.appendChild(dropDownComponent);

		const field = this.field(inputGroup, dropDownComponent);
		field.attOptions = attOptions;
		field.addOption = addOption;

		if (dropDownObj.options !== undefined) field.attOptions(dropDownObj.options);

		return field;
	}
};
