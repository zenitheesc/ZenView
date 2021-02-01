
module.exports = class Field {

	constructor(options) {

		this.htmlComponent = options.htmlComponent || {};
		this.input = options.input || {};
		this.id = options.id || {};
		this.att = options.att || options.id || options.label;
		this.parsedAtt = [];
		this.type = options.type || {};
		this.classList = options.classList || {};
		this.value = options.value || '';
		this.standardValue = options.standardValue || '';
		this.validators = options.validators;
		this.group = options.group || {};
		this.conditions = options.conditions || [];
		this.label = options.label || {};
		this.prepend = options.prepend || {};
		this.append = options.append || {};
		this.onclick;
		this.warning = options.warning;
		this._init();

	}

	_init() {

		if (this.type === 'button') {

			this.validators = undefined;

		}

	}

	set onclick(callBackFunction) {

		this.input.onclick = (callBackFunction);

	}

	get value() {

		if (this.type === 'editableDiv') {

			return this.input.textContent;

		} else if (this.type === 'checkbox') {

			return this.input.checked;

		}
		return this.input.value;

	}

	set value(value) {

		if (this.type === 'editableDiv') {

			this.input.innerHTML = value;

		} else if (this.type === 'checkbox') {

			this.input.value = value;
			this.input.checked = value;

		} else {

			this.input.value = value;

		}

	}

	reset() {

		if (this.type === 'editableDiv') {

			this.input.innerHTML = '';

		} else if (this.type === 'select') {

			if (this.input.options.length > 0) {

				this.input.options[0].selected = 'selected';

			} else {

				this.input.value = '';

			}

		} else {

			this.input.value = this.standardValue;

		}

	}

	setConditions(form) {

		this.conditions.forEach((condition) => {

			const element = form.querySelector('#' + condition.id);
			if (element == null) {

				throw new Error(`${condition.id} didn't exists, the element conditions must be on the DOM`);

			}
			element.addEventListener('input', () => {

				this.testConditions(form);

			});

		});

		this.testConditions(form);

	}

	testConditions(form) {

		let count = 0;
		this.conditions.forEach((condition) => {

			if (form.querySelector('#' + condition.id)[condition.att] == condition.requiredValue) {

				count++;

			}

		});
		if (count === this.conditions.length) {

			this.htmlComponent.classList.remove('d-none');

		} else {

			this.htmlComponent.classList.add('d-none');

		}

	}
	
	setAttribute(attributesUntilHere) {

		let cont = 0;
		if (this.att) {

			while (String(this.att).startsWith('../')) {

				this.att = String(this.att).replace('../', '');
				cont++;

			}
			const splited = attributesUntilHere.split('.');
			const sliced = splited.slice(0, splited.length - cont);

			this.att.split('.').forEach((att) => {

				sliced.push(att);

			});

			this.parsedAtt = sliced;
			this.att = sliced.join('.');

		}

	}

	validate() {

		if (this.htmlComponent.offsetWidth <= 0 && this.htmlComponent.offsetHeight <= 0) {

			this.hideWarning();
			return true;

		}

		let isValid = true;
		if (this.validators === undefined) return true;

		for (let i = 0, j = this.validators.length; i < j; i++) {

			const response = this.validators[i](this.value);
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

	showWarning(txt) {

		this.warning.textContent = txt;
		this.input.classList.add('is-invalid');

	}

	hideWarning() {

		this.input.classList.remove('is-invalid');

	}

	static _attClassList(htmlComponent, classList) {

		try {

			classList.forEach((className) => {

				htmlComponent.classList.add(className);

			});

		} catch (error) {

			htmlComponent.classList.add(classList);

		}

	}

	static _label(text, id) {

		const labelElement = document.createElement('small');
		labelElement.classList.add('text-muted');
		labelElement.classList.add('form-text');
		if (id !== undefined) labelElement.setAttribute('for', id);
		labelElement.textContent = text;
		return labelElement;

	}

	static _inputGroup() {

		const inputGroupElement = document.createElement('div');
		this._attClassList(inputGroupElement, ['formBuilderInputGroup', 'input-group-sm', 'mb-2']);
		return inputGroupElement;

	}

};