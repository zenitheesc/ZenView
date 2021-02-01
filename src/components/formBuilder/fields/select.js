const Field = require('../Field');

module.exports = class Select extends Field {

	constructor(options) {

		super(options);

	}

	addOption(option, callBack) {

		callBack = callBack || function(option) {

			return [option.value || option.text, option.text || option.value];

		};

		const newOption = document.createElement('option');
		[newOption.value, newOption.text] = callBack(option);
		this.input.appendChild(newOption);

	};

	setOptions(options, callBack) {

		this.input.innerHTML = '';
		callBack = callBack || function(option) {

			return [option.value || option.text, option.text || option.value];

		};

		let newOption;
		options.forEach((option) => {

			newOption = document.createElement('option');
			[newOption.value, newOption.text] = callBack(option);
			this.input.appendChild(newOption);

		});

		if (options.length > 0) {

			this.input.options[0].selected = 'selected';

		}


	};

	setSelectedOptios(value) {

		input.value = value;

	};

	static buildCore(options) {

		const input = document.createElement('select');
		options.type = 'select';
		input.classList.add('form-control');
		if (options.id !== undefined) input.id = options.id;
		options.input = input;

		return options;

	}

};