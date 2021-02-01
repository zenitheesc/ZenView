const Field = require('../Field');

module.exports = class CheckBox extends Field {

	constructor(options) {

		super(options);

	}

	static buildCore(options) {
		
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

		return options;

	}

};