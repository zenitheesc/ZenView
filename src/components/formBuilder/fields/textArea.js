const Field = require('../Field');

module.exports = class TextArea extends Field {

	constructor(options) {

		super(options);

	}

	static buildCore(options) {

		const input = document.createElement('textarea');
		options.type = 'textArea';
		input.classList.add('form-control');
		input.style.height = '16em';
		if (options.id !== undefined) input.id = options.id;
		options.input = input;

		return options;

	}

};