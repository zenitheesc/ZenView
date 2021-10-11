const Fields = require('./fieldsWrapper');
const ipc = require('electron').ipcRenderer;
module.exports = class FieldsBuilder {

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

		let config = Fields.Text.buildCore(options);
		config = this.build(config);
		return new Fields.Text(config);

	}

	static number(options) {

		let config = Fields.Number.buildCore(options);
		config = this.build(config);
		return new Fields.Number(config);

	}

	static textArea(options) {

		let config = Fields.TextArea.buildCore(options);
		config = this.build(config);
		return new Fields.TextArea(config);

	}

	static editableDiv(options) {

		let config = Fields.EditableDiv.buildCore(options);
		config = this.build(config);
		return new Fields.EditableDiv(config);

	}

	static button(options) {

		const config = Fields.Button.buildCore(options);
		return new Fields.Button(config);

	}

	static checkBox(options) {

		const config = Fields.CheckBox.buildCore(options);
		return new Fields.CheckBox(config);

	}

	static select(options) {

		let config = Fields.Select.buildCore(options);
		config = this.build(config);
		const selectField = new Fields.Select(config);
		if (options.options) selectField.setOptions(options.options);
		return selectField;

	}

	static directory(options) {

		let config = Fields.Directory.buildCore(options);
		config = this.build(config);
		const directoryField = new Fields.Directory(config);
		
		if (options.type === 'file') {

			directoryField.prepend[0].onclick = () => {

				ipc.send('open-file-dialog-for-file', 'csv');

				ipc.on('selected-dir', (evt, arg) => {

					if (arg !== '' && arg !== undefined) {

						directoryField.input.value = arg ?? '';
						directoryField.input.textContent = arg ?? '';
						directoryField.input.dispatchEvent(new Event('input'));

					}
					ipc.removeAllListeners('selected-dir');

				});

			};

		} else {

			directoryField.prepend[0].onclick = () => {

				ipc.send('open-file-dialog-for-dir');

				ipc.on('selected-dir', (evt, arg) => {

					if (arg !== '' && arg !== undefined) {

						directoryField.input.value = arg ?? '';
						directoryField.input.textContent = arg ?? '';
						directoryField.input.dispatchEvent(new Event('input'));

					}
					ipc.removeAllListeners('selected-dir');

				});

			};

		}

		return directoryField;

	}

	static colorPicker(options) {

		const config = Fields.ColorPicker.buildCore(options);
		return new Fields.ColorPicker(config);

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

	static build(options) {

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

		insideInputGroup.appendChild(options.input);


		if (options.append) {

			const append = this._addAppend(options.append);
			insideInputGroup.appendChild(append.component);
			options.append = append.list;

		}

		const warning = this._invalidWarning(options.id);

		if (options.validators !== undefined) insideInputGroup.appendChild(warning);

		inputGroup.appendChild(insideInputGroup);


		options.htmlComponent = inputGroup;
		options.warning = warning;

		return options;

	}

};