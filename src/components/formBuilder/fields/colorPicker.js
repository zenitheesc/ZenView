const Field = require('../Field');
const JSColor = require('../../../externalSources/jscolor');

module.exports = class ColorPicker extends Field {

	constructor(options) {

		super(options);
		this.setInputEvent();

	}

	static buildCore(options) {

		const input = document.createElement('input');
		const opts = {
			preset: 'large dark',
			value: '#FFFFFF',
			backgroundColor: '#1a1a1a',
			borderColor: '#a9a9a963',
			borderRadius: '4',
			pointerColor: '#2b2b2b',
			controlBorderColor: 'darkgray',
			pointerBorderColor: 'darkgray',
		};

		input.type = options.type = 'colorPicker';
		input.classList.add('form-control');
		input.style.width = '100%';

		input.id = options.id || 'colorPicker';

		// eslint-disable-next-line no-unused-vars
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

		return options;

	}

	set value(value) {

		this.input.value = value;
		this.input.jscolor.fromString(value);

	}

	get value() {

		return this.input.value;

	}

	setInputEvent() {

		this.input.addEventListener('input', (evt) => {

			if (!evt.doNotIgnore) {

				evt.stopPropagation();

			}

		});

		this.input.addEventListener('change', (evt) => {

			const event = new Event('input', {bubbles: true});
			event.doNotIgnore = true;
			this.input.dispatchEvent(event);
			evt.stopPropagation();

		});

	}

};
