/**
 * ColorPicker
 */

const FieldClass = require('./Field');
const Field = require('./FieldsBuilder');

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
		this.containers = [];
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

			if (this.config[property] instanceof FieldClass) {

				this.formThree[property] = this.config[property];
				this.fields.push(this.config[property]);


			} else {

				this.formThree[property] = this.config[property].formThree;
				this.containers.push(this.config[property]);

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


		for (let i = 0; i < this.containers.length; i++) {

			if (!this.containers[i].validate()) {
				response = false;
			}

		}

		for (let i = 0; i < this.fields.length; i++) {

			if (!this.fields[i].validate()) {

				response = false;

			}

		}

		return response;

	}

	getData(preResponse) {

		const response = preResponse || {};

		this.containers.forEach((container) => {

			container.getData(response);

		});

		this.fields.forEach((field) => {

			this.createResponseObj(response, field.parsedAtt, field.value);

		});

		return response.form || response;

	}

	setData(DataObj) {

		this.containers.forEach((container) => {

			container.setData(DataObj);

		});

		this.fields.forEach((field) => {

			const paths = field.att.split('.');
			let result;

			for (const path of paths) {
				result = result?.[path] ?? DataObj?.[path];
			}

			field.value = result ?? field.value;

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

		this.containers.forEach((container) => {

			container.reset();

		});


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

		const headerTitle = document.createElement('span');
		headerTitle.textContent = containerConfig.text;
		cardHeader.appendChild(headerTitle);

		cardHeader.innerHTML +=
			`<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
		<path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5
		 0 0 1 0-.708z"/></svg>`;

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