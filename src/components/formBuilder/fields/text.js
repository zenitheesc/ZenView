const Field = require('../Field');

module.exports = class Text extends Field {

	constructor(options) {

		super(options);

	}

	static buildCore(options) {

		const input = document.createElement('input');
		input.type = options.type = 'text';
		input.classList.add('form-control');
		if (options.id !== undefined) input.id = options.id;
		options.input = input;
		
		return options;
		
	}

};