/**
 * ColorPicker
 */

const ipc = require('electron').ipcRenderer;

class FormPattern {

	constructor(config, formConfig) {

		config = config || {};
		formConfig = formConfig || {};
		this.htmlComponent = document.createElement('form');
		this.htmlComponent.onsubmit = () => {

			return false;

		};
		if (formConfig.className !== undefined) this.htmlComponent.className = formConfig.className;
		this.config = config;
		this.fields = [];
		this.conditions = [];
		this.formThree = {};
		this._BuildFormThree();
		this._buildHtmlComponent(config);
		formConfig = formConfig || {};
		this.att = formConfig.att || false;
		this.conditions = formConfig.conditions || [];

	}

	_buildHtmlComponent() {

		Object.keys(this.config).forEach((e) => {

			this.htmlComponent.appendChild(this.config[e].htmlComponent);

		});

	}

	_BuildFormThree() {

		this.formThree['self'] = this;
		Object.keys(this.config).forEach((property) => {

			if (this.config[property].constructor.name === 'Field') {

				this.formThree[property] = this.config[property];
				this.fields.push(this.config[property]);

			} else {

				this.fields = this.fields.concat(this.config[property].fields);
				this.formThree[property] = this.config[property].formThree;

			}

		});
		return this.formThree;

	}

	setAttribute(attributesUntilHere) {

		let cont = 0;
		if (this.att) {

			while (String(this.att).startsWith('../')) {

				this.att = String(this.att).replace('../', '');
				cont++;

			}
			if (attributesUntilHere !== undefined) {

				const splited = attributesUntilHere.split('.');
				const sliced = splited.slice(0, splited.length - cont);
				sliced.push(this.att);
				this.att = sliced.join('.');

			}
			attributesUntilHere = this.att;

		}
		Object.keys(this.config).forEach((property) => {

			this.config[property].setAttribute(attributesUntilHere);

		});

	}

	setConditions(form) {

		form = form || this.htmlComponent;
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

		Object.keys(this.config).forEach((property) => {

			this.config[property].setConditions(form);

		});

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

	validate() {

		let response = true;

		for (let i = 0, j = this.fields.length; i < j; i++) {

			if (!this.fields[i].validate()) {

				response = false;

			}

		}
		return response;

	}

	getData() {

		const response = {};
		this.fields.forEach((field) => {

			this.createResponseObj(response, field.parsedAtt, field.value);

		});
		return response.form || response;

	}

	setData(DataObj) {

		const wrapper = {};
		wrapper.form = DataObj;
		const atts = this.objToPathList(wrapper);

		this.fields.forEach((field)=>{

			if (atts[field.att] !== undefined ) {

				field.value = atts[field.att];

			}

		});

	}

	objToPathList(obj) {

		const isObject = (val) =>
			typeof val === 'object' && !Array.isArray(val);

		const addDelimiter = (a, b) => a ? `${a}.${b}` : b;

		const paths = (obj = {}, head = '') => {

			return Object.entries(obj)
				.reduce((product, [key, value]) => {

					const fullPath = addDelimiter(head, key);
					return isObject(value) ?
						product.concat(paths(value, fullPath)) :
						product.concat({
							'path': fullPath,
							'value': value,
						});

				}, []);

		};

		const objOfPaths = {};
		const ArrayOfPaths = paths(obj);

		ArrayOfPaths.forEach((path) => {

			objOfPaths[path.path] = path.value;

		});

		return objOfPaths;

	}

	createResponseObj(pointer, path, value) {

		const lastName = (arguments.length === 3) ? path.pop() : false;

		for (let i = 0, j = path.length; i < j; i++) {

			pointer = pointer[path[i]] = pointer[path[i]] || {};

		}

		if (lastName) {

			pointer = pointer[lastName] = value;

			path.push(lastName);

		}

		return pointer;

	}

	reset() {

		this.fields.forEach((field) => {

			field.reset();

		});

	}

}

class Form extends FormPattern {

	constructor(config, formConfig) {

		formConfig = formConfig || {};
		formConfig.att = formConfig.att || 'form';
		super(config, formConfig);
		this.setAttribute();
		this.setConditions();

	}

}

class Field {

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
	static _addPrepend(options) {

		const temp = this._buildAppendAndPrepend(options);
		const appendHtmlComponentList = temp.list;
		const component = temp.component;

		component.classList.add('input-group-prepend');

		return {
			list: appendHtmlComponentList,
			component: component,
		};

	}
	static _addAppend(options) {

		const temp = this._buildAppendAndPrepend(options);
		const appendHtmlComponentList = temp.list;
		const component = temp.component;
		component.classList.add('input-group-append');

		return {
			list: appendHtmlComponentList,
			component: component,
		};

	}
	static _buildAppendAndPrepend(options) {

		const componentList = [];
		const component = document.createElement('div');

		options.forEach((element) => {

			element.classList = element.classList || [];
			if (element.type === 'text') {

				const spanComponent = document.createElement('span');
				spanComponent.classList.add('input-group-text');
				if (element.id) spanComponent.id = element.id;
				this._attClassList(spanComponent, element.classList);
				spanComponent.textContent = element.text;
				component.appendChild(spanComponent);
				componentList.push(spanComponent);

			} else if (element.type === 'button') {

				const button = document.createElement('button');
				button.type = 'button';
				if (element.id) button.id = element.id;
				this._attClassList(button, element.classList);
				button.innerHTML = element.content;
				component.appendChild(button);
				componentList.push(button);

			}

		});
		return {
			list: componentList,
			component: component,
		};

	}
	static _inputGroup() {

		const inputGroupElement = document.createElement('div');
		this._attClassList(inputGroupElement, ['formBuilderInputGroup', 'input-group-sm', 'mb-2']);
		return inputGroupElement;

	}
	static text(options) {

		const input = document.createElement('input');
		input.type = options.type = 'text';
		input.classList.add('form-control');
		if (options.id !== undefined) input.id = options.id;
		return this.build(options, input);

	}
	static number(options) {

		const input = document.createElement('input');
		input.type = options.type = 'number';
		input.classList.add('form-control');
		if (options.id !== undefined) input.id = options.id;
		return this.build(options, input);

	}
	static textArea(options) {

		const input = document.createElement('textarea');
		options.type = 'textArea';
		input.classList.add('form-control');
		input.style.height = '16em';
		if (options.id !== undefined) input.id = options.id;
		return this.build(options, input);

	}
	static editableDiv(options) {

		const input = document.createElement('div');
		options.type = 'editableDiv';
		input.contentEditable = true;
		input.classList.add('editableDiv');
		input.style.height = '4em';
		input.style.height = 'auto';
		if (options.id !== undefined) input.id = options.id;
		input.classList.add('form-control');
		return this.build(options, input);

	}
	static button(options) {

		options.classList = options.classList || [];

		const buttonComponent = document.createElement('button');
		buttonComponent.textContent = options.text;
		options.type = 'button';
		buttonComponent.type = options.type || 'button';

		this._attClassList(buttonComponent, ['formBuilderBtn']);
		this._attClassList(buttonComponent, options.classList);

		options.htmlComponent = buttonComponent;
		options.input = buttonComponent;

		return new Field(options);

	}
	static checkBox(options) {

		const checkGroup = document.createElement('div');
		this._attClassList(checkGroup, ['form-check']);

		options.classList = options.classList || [];
		this._attClassList(checkGroup, options.classList);

		const input = document.createElement('input');
		input.type = options.type = 'checkbox';
		this._attClassList(input, ['form-check-input']);


		const label = document.createElement('label');
		this._attClassList(label, ['form-check-label']);
		label.textContent = options.label;
		checkGroup.appendChild(input);
		checkGroup.appendChild(label);
		options.htmlComponent = checkGroup;
		options.input = input;
		if (options.id !== undefined) input.id = options.id;
		return new Field(options);

	}
	static select(options) {

		const input = document.createElement('select');
		options.type = 'select';
		input.classList.add('form-control');
		if (options.id !== undefined) input.id = options.id;
		const field = this.build(options, input);

		field.addOption = (option, callBack) => {

			callBack = callBack || function(option) {

				return [option.value || option.text, option.text || option.value];

			};

			const newOption = document.createElement('option');
			[newOption.value, newOption.text] = callBack(option);
			field.input.appendChild(newOption);

		};

		field.setOptions = (options, callBack) => {

			field.input.innerHTML = '';
			callBack = callBack || function(option) {

				return [option.value || option.text, option.text || option.value];

			};

			let newOption;
			options.forEach((option) => {

				newOption = document.createElement('option');
				[newOption.value, newOption.text] = callBack(option);
				field.input.appendChild(newOption);

			});

		};

		field.setSelectedOption = (value) => {

			input.value = value;

		};

		if (options.options) field.setOptions(options.options);

		return field;

	}
	static directory(options) {

		const input = document.createElement('input');
		options.type = options.type || 'dir';
		input.type = 'text';
		input.classList.add('form-control');
		if (options.id !== undefined) input.id = options.id;
		input.disabled = true;
		const icon = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-folder2-open"
						fill="currentColor" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 
						2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856
						 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5
						  1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374
						   3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64
						    5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0
							 0 0 14.367 7H1.633z"/>
					  </svg>`;
		options.prepend = [{
			type: 'button',
			content: icon,
			classList: ['formButtonWithIconPrepend'],
		}];

		const field = this.build(options, input);
		if (options.type === 'file') {

			field.prepend[0].onclick = () => {

				ipc.send('open-file-dialog-for-file');

				ipc.on('selected-dir', (evt, arg) => {

					if (arg !== '' && arg !== undefined) {

						field.input.value = arg || '';
						field.input.textContent = arg || '';
						field.input.dispatchEvent(new Event('input'));

					}
					ipc.removeAllListeners('selected-dir');

				});

			};

		} else {

			field.prepend[0].onclick = () => {

				ipc.send('open-file-dialog-for-dir');

				ipc.on('selected-dir', (evt, arg) => {

					if (arg !== '' && arg !== undefined) {

						field.input.value = arg || '';
						field.input.textContent = arg || '';
						field.input.dispatchEvent(new Event('input'));

					}
					ipc.removeAllListeners('selected-dir');

				});

			};

		}


		return field;

	}
	static colorPicker(options){

		// Extração do valor da cor: this.colorPicker.input.jscolor.toHEXString()

		const input = document.createElement('input');
		const opts = {
			preset: 'large dark', 
			value:'#FFFFFF', 
			backgroundColor:'#1a1a1a', 
			borderColor:'#a9a9a963',
			borderRadius: '4',
			pointerColor:'#2b2b2b',
			controlBorderColor: 'darkgray',
			pointerBorderColor:'darkgray',
		};

		input.type = options.type = 'colorPicker';
		input.classList.add('form-control');
		input.style.width = '100%';

		if (options.id !== undefined) {
			input.id = options.id;
		} else {
			input.id = 'colorPicker';
		} 

		const colorPicker = new JSColor(input, opts);

		const inputGroup = this._inputGroup(options);
		this._attClassList(inputGroup, options.classList);

		const insideInputGroup = this._inputGroup(options);
		insideInputGroup.classList.add('input-group');

		inputGroup.appendChild(this._label(options.label, options.id));

		insideInputGroup.appendChild(input);
		inputGroup.appendChild(insideInputGroup);

		options.htmlComponent = inputGroup;
		options.input = input;

		return new Field(options);

	}
	static _label(text, id) {

		const labelElement = document.createElement('small');
		labelElement.classList.add('text-muted');
		labelElement.classList.add('form-text');
		if (id !== undefined) labelElement.setAttribute('for', id);
		labelElement.textContent = text;
		return labelElement;

	}
	static _invalidWarning(id) {

		const errorMsg = document.createElement('div');
		errorMsg.className = 'invalid-feedback';
		if (id) errorMsg.id = id + '_invalid';
		return errorMsg;

	}
	static build(options, input) {

		options.classList = options.classList || [];

		const inputGroup = this._inputGroup(options);
		this._attClassList(inputGroup, options.classList);

		const insideInputGroup = this._inputGroup(options);
		insideInputGroup.classList.add('input-group');

		inputGroup.appendChild(this._label(options.label, options.id));

		if (options.prepend) {

			const prepend = this._addPrepend(options.prepend);
			insideInputGroup.appendChild(prepend.component);
			options.prepend = prepend.list;

		}

		insideInputGroup.appendChild(input);


		if (options.append) {

			const append = this._addAppend(options.append);
			insideInputGroup.appendChild(append.component);
			options.append = append.list;

		}

		const warning = this._invalidWarning(options.id);

		if (options.validators !== undefined) insideInputGroup.appendChild(warning);

		inputGroup.appendChild(insideInputGroup);


		options.htmlComponent = inputGroup;
		options.input = input;
		options.warning = warning;

		return new Field(options);

	}

}

class Container extends FormPattern {

	static div(config, containerConfig) {

		const container = new Container(config, containerConfig);
		return container;

	}
	static formRow(config, containerConfig) {

		containerConfig = containerConfig || {};
		containerConfig.className = 'form-row';
		const container = new Container(config, containerConfig);
		return container;

	}
	static spliter(config, containerConfig) {

		containerConfig = containerConfig || {};
		const container = new Container(config, containerConfig);

		const card = document.createElement('div');

		card.className = 'card menuSpliter';

		const cardHeader = document.createElement('div');

		cardHeader.id = containerConfig.id + '_header';
		cardHeader.setAttribute('data-toggle', 'collapse');
		cardHeader.setAttribute('data-target', `#menu_${containerConfig.id}_option`);
		cardHeader.setAttribute('aria-expanded', containerConfig.startOpen);
		cardHeader.setAttribute('aria-controls', `menu_${containerConfig.id}_option`);
		cardHeader.textContent = containerConfig.text;

		const cardBodyCollapse = document.createElement('div');
		cardBodyCollapse.id = `menu_${containerConfig.id}_option`;

		if (containerConfig.startOpen) {

			cardBodyCollapse.className = 'collapse show';
			cardHeader.className = 'card-header menuSpliter-header';

		} else {

			cardHeader.className = 'card-header menuSpliter-header collapsed';
			cardBodyCollapse.className = 'collapse';

		}

		cardBodyCollapse.setAttribute('aria-labelledby', `${containerConfig.id}_option`);

		const cardBody = document.createElement('div');
		cardBody.className = 'card-body form-group';
		cardBody.appendChild(container.htmlComponent);
		cardBodyCollapse.appendChild(cardBody);
		cardBody.id = containerConfig.id + '_body';
		card.appendChild(cardHeader);
		card.appendChild(cardBodyCollapse);
		container.htmlComponent = card;
		return container;

	}

}

module.exports = {
	Form,
	Field,
	Container,
};