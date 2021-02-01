const Field = require('../Field');

module.exports = class EditableDiv extends Field {

	constructor(options) {

		super(options);

	}

	get value() {

		return this.input.textContent;

	}

	set value(value) {

		this.input.innerHTML = value;

	}

	reset() {

		this.input.innerHTML = this.standardValue || '';

	}

	static buildCore(options) {

		const input = document.createElement('div');
		options.type = 'editableDiv';
		input.contentEditable = true;
		input.classList.add('editableDiv');
		input.style.height = '4em';
		input.style.height = 'auto';
		if (options.id !== undefined) input.id = options.id;
		input.classList.add('form-control');
		options.input = input;

		return options;

	}

};