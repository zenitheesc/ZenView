const fs = require('fs');
const ipc = require('electron').ipcRenderer;
module.exports = class Components {
	static spliter(id, text, content, startOpen) {
		let card = document.createElement('div');
		card.className = 'card menuSpliter';

		let cardHeader = document.createElement('div');

		cardHeader.id = id + '_header';
		cardHeader.setAttribute('data-toggle', 'collapse');
		cardHeader.setAttribute('data-target', `#menu_${id}_option`);
		cardHeader.setAttribute('aria-expanded', startOpen);
		cardHeader.setAttribute('aria-controls', `menu_${id}_option`);
		cardHeader.textContent = text;

		let cardBodyCollapse = document.createElement('div');
		cardBodyCollapse.id = `menu_${id}_option`;

		if (startOpen) {
			cardBodyCollapse.className = 'collapse show';
			cardHeader.className = 'card-header menuSpliter-header';
		} else {
			cardHeader.className = 'card-header menuSpliter-header collapsed';
			cardBodyCollapse.className = 'collapse';
		}

		cardBodyCollapse.setAttribute('aria-labelledby', `${id}_option`);

		let cardBody = document.createElement('div');
		cardBody.className = 'card-body form-group';
		cardBody.appendChild(content);
		cardBodyCollapse.appendChild(cardBody);
		cardBody.id = id + '_body';
		card.appendChild(cardHeader);
		card.appendChild(cardBodyCollapse);

		return card;
	}
	static menuHeader(text, optionsContent) {
		let menuHeaderComponent = document.createElement('div');
		let title = document.createElement('h6');
		title.textContent = text;
		menuHeaderComponent.className = 'menuHeader';

		menuHeaderComponent.appendChild(title);

		if (optionsContent != undefined) {
			let options = document.createElement('div');
			options.appendChild(optionsContent);
			menuHeaderComponent.appendChild(options);
		}

		return menuHeaderComponent;
	}
	static invalidWarning(id) {
		let errorMsg = document.createElement('div');
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
				this.input.addEventListener('input',()=>{
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
					let response = this.tests[i](this.value);
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
		let smallComponent = document.createElement('small');
		smallComponent.className = 'form-text text-muted';
		smallComponent.textContent = text;
		return smallComponent;
	}
	static inpuGroup(className) {
		let inputGroupComponent = document.createElement('div');
		inputGroupComponent.classList.add('input-group-sm');
		inputGroupComponent.classList.add('mb-3');
		if (className !== undefined) inputGroupComponent.classList.add(className);

		return inputGroupComponent;
	}
	static input(id, tipo) {
		let inputComponent = document.createElement('input');

		inputComponent.id = id;
		inputComponent.type = tipo;
		inputComponent.className = 'form-control';
		inputComponent.setAttribute('aria-label', 'Small');
		inputComponent.setAttribute('aria-describedby', 'inputGroup-sizing-sm');

		return inputComponent;
	}
	static textInput(textInputObj) {
		let textInputComponent = {};
		textInputComponent.htmlComponent = this.inpuGroup(textInputObj.className);

		textInputComponent.htmlComponent.appendChild(this.small(textInputObj.text));

		textInputComponent.input = this.input(textInputObj.id, 'text');

		textInputComponent.htmlComponent.appendChild(textInputComponent.input);

		textInputComponent.warning = this.invalidWarning(textInputObj.id);

		textInputComponent.htmlComponent.appendChild(textInputComponent.warning);

		return this.field(textInputComponent.htmlComponent, textInputComponent.input, textInputComponent.warning, textInputObj.tests);
	}
	static numberInput(numberInputObj) {
		let textInputGroup = this.inpuGroup();

		textInputGroup.appendChild(this.small(numberInputObj.text));

		let textInputComponent = this.input(numberInputObj.id, 'number');

		let warning = this.invalidWarning(numberInputObj.id);

		textInputGroup.appendChild(textInputComponent);

		textInputGroup.appendChild(warning);

		return this.field(textInputGroup, textInputComponent, warning, numberInputObj.tests);
	}
	static textArea(textAreaObj) {
		let textInputGroup = this.inpuGroup();

		textInputGroup.appendChild(this.small(textAreaObj.text));

		let textInputComponent = document.createElement('textarea');
		textInputComponent.id = textAreaObj.id;
		textInputComponent.className = 'form-control';
		textInputComponent.setAttribute('aria-label', 'Small');
		textInputComponent.setAttribute('aria-describedby', 'inputGroup-sizing-sm');
		textInputGroup.appendChild(textInputComponent);

		let warning = this.invalidWarning(textAreaObj.id);

		textInputGroup.appendChild(warning);

		return this.field(textInputGroup, textInputComponent, warning, textAreaObj.tests);
	}
	static icon(iconName) {
		return (fs.readFileSync('./src/images/icons/' + iconName + '.svg')).toString();
	}
	static dashBoardCard(name, desc, path) {
		let dashBoardCardComponent = document.createElement('div');
		dashBoardCardComponent.setAttribute('class', 'card dashBoardCard mb-3');

		let dashBoardCardComponentHeader = document.createElement('div');
		dashBoardCardComponentHeader.setAttribute('class', 'card-header row dashBoardCard-header m-0 justify-content-between');

		let dashBoardCardComponentHeaderTitle = document.createElement('div');
		dashBoardCardComponentHeaderTitle.innerText = name;

		let dashBoardCardComponentHeaderOptions = document.createElement('div');

		dashBoardCardComponentHeader.appendChild(dashBoardCardComponentHeaderTitle);


		let playBtn = document.createElement('button');
		let editBtn = document.createElement('button');
		let delBtn = document.createElement('button');

		playBtn.className = 'dashBoardCardOption';
		editBtn.className = 'dashBoardCardOption';
		delBtn.className = 'dashBoardCardOption';

		playBtn.innerHTML = this.icon('play');
		editBtn.innerHTML = this.icon('pencil-square');
		delBtn.innerHTML = this.icon('trash');

		dashBoardCardComponentHeaderOptions.appendChild(playBtn);
		dashBoardCardComponentHeaderOptions.appendChild(editBtn);
		dashBoardCardComponentHeaderOptions.appendChild(delBtn);

		dashBoardCardComponentHeader.appendChild(dashBoardCardComponentHeaderOptions);

		let dashBoardCardComponentBody = document.createElement('div');
		dashBoardCardComponentBody.className = 'card-body';

		let dashBoardCardComponentDesc = document.createElement('p');
		dashBoardCardComponentDesc.textContent = desc;

		let dashBoardCardComponentPath = document.createElement('cite');
		dashBoardCardComponentPath.textContent = 'PATH:' + path;

		dashBoardCardComponentBody.appendChild(dashBoardCardComponentDesc);
		dashBoardCardComponentBody.appendChild(dashBoardCardComponentPath);

		dashBoardCardComponent.appendChild(dashBoardCardComponentHeader);
		dashBoardCardComponent.appendChild(dashBoardCardComponentBody);

		return dashBoardCardComponent;
	}
	static inputCard(id) {
		let inputCardComponent = document.createElement('div');
		let inputCardComponentRow1 = document.createElement('div');
		let inputCardComponentRow2 = document.createElement('div');
		inputCardComponent.className = 'inputCard mb-2';

		inputCardComponentRow1.className = 'form-row';
		inputCardComponentRow2.className = 'form-row';

		let saveBtn = document.createElement('button');
		let delBtn = document.createElement('button');

		saveBtn.className = 'inputCard';
		delBtn.className = 'inputCard';

		saveBtn.innerHTML = this.icon('save');
		delBtn.innerHTML = this.icon('trash');

		inputCardComponentRow1.appendChild(this.textInput({
			text: 'Nome',
			id: id + '_name',
			className: 'col-10'
			//tests: [Validator.isFilled, Validator.noSpecialChars]
		}).htmlComponent);

		inputCardComponentRow2.appendChild(this.textInput({
			text: 'Retorno',
			id: id + '_return',
			className: 'col-10'
			//tests: [Validator.isFilled, Validator.noSpecialChars]
		}).htmlComponent);

		inputCardComponentRow1.appendChild(saveBtn);
		inputCardComponentRow2.appendChild(delBtn);

		inputCardComponent.appendChild(inputCardComponentRow1);
		inputCardComponent.appendChild(inputCardComponentRow2);

		return inputCardComponent;
	}
	static pathInput(pathInputObj) {
		let pathInputGroup = document.createElement('div');

		pathInputGroup.className = 'input-group mb-3 pathInput';
		pathInputGroup.classList.add(pathInputObj.className);

		pathInputGroup.appendChild(this.small(pathInputObj.text));

		let inputConainer = document.createElement('div');
		inputConainer.className = 'input-group';
		let inputGroupPrepend = document.createElement('div');
		inputGroupPrepend.className = 'input-group-prepend';

		let inputGroupPrependButton = document.createElement('button');
		inputGroupPrependButton.type = 'button';
		inputGroupPrependButton.innerHTML = this.icon('folder2-open');

		inputGroupPrepend.appendChild(inputGroupPrependButton);

		inputConainer.appendChild(inputGroupPrepend);

		let pathInputComponent = document.createElement('input');
		pathInputComponent.disabled = true;
		pathInputComponent.id = pathInputObj.id;
		pathInputComponent.type = 'text';
		pathInputComponent.className = 'form-control';
		pathInputComponent.setAttribute('aria-describedby', 'basic-addon1');
		inputConainer.appendChild(pathInputComponent);
		inputConainer.appendChild(this.invalidWarning(pathInputObj.id));

		pathInputGroup.appendChild(inputConainer);

		let warning = this.invalidWarning(pathInputObj.id);
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
		let formComponent = {};
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
			let response = {};
			
			formComponent.fields.forEach((field) => {
				response[field.id] = field.value;
			});
			return response;
		};

		formComponent.validate = () => {
			let response = true;
			formComponent.fields.forEach((field) => {
				if(!field.validate()){
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
};