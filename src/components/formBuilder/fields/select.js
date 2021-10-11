const Field = require('../Field');

module.exports = class Select extends Field {

	constructor(options) {

		super(options);

	}

	set value(value) {

		let found = false;

		for (let i = 0; i < this.input.options.length; i++) {

			if (this.input.options[i].value == value ?? this.input.options[i].text == value) {

				found = true;
				this.input.options[i].selected = 'select';
				break;

			}

		}

		if (!found && this.input.options.length > 0) {

			this.input.options[0].selected = 'select';

		}

	}

	get value() {

		return this.input.value;

	}

	addOption(option, callBack) {

		callBack = callBack || function (option) {

			return [option.value ?? option.text, option.text ?? option.value];

		};

		const newOption = document.createElement('option');
		[newOption.value, newOption.text] = callBack(option);
		this.input.appendChild(newOption);

	};

	setOptions(options, callBack) {

		this.input.innerHTML = '';
		callBack = callBack || function (option) {

			return [option.value ?? option.text, option.text ?? option.value];

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

	setSelectedOption(value) {

		this.input.value = value;

	};

	reset() {

		if (this.input.options.length > 0) {

			this.input.options[0].selected = 'selected';

		} else {

			this.input.value = '';

		}

		this.hideWarning();

	}

	static buildCore(options) {

		const input = document.createElement('select');
		options.type = 'select';
		input.classList.add('form-control');
		if (options.id !== undefined) input.id = options.id;
		options.input = input;

		return options;

	}

};