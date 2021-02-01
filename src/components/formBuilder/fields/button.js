const Field = require('../Field');

module.exports = class Button extends Field {

	constructor(options) {

		super(options);
		this.validators = undefined;
		
	}

	static buildCore(options) {

		options.classList = options.classList || [];

		const buttonComponent = document.createElement('button');
		buttonComponent.textContent = options.text;
		options.type = 'button';
		buttonComponent.type = options.type || 'button';

		this._attClassList(buttonComponent, ['formBuilderBtn']);
		this._attClassList(buttonComponent, options.classList);

		options.htmlComponent = buttonComponent;
		options.input = buttonComponent;

		return options;

	}

};