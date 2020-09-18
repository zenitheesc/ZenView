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
	static icon(iconName) {
		return (fs.readFileSync('./src/images/icons/' + iconName + '.svg')).toString();
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
};
