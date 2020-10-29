const Block = require('../block');
const Plotly = require('plotly.js');
const loadash = require('lodash');
// eslint-disable-next-line no-unused-vars
const ElementResize = require('javascript-detect-element-resize');

module.exports = class scatter extends Block {

	constructor(preConfig) {

		super();

		this.config = (preConfig) ? preConfig.config : {};
		this.layout = (preConfig) ? preConfig.layout : {};
		this.data = (preConfig) ? preConfig.data : [];

	}

	addTrace() {

	}

	rmvTrace() {

	}

	attData() {

	}

	attLayout() {

	}

	attConfig() {

	}

	setAutoResize() {

		const widget = this.htmlComponent.parentElement;
		addResizeListener(widget, () => {

			Plotly.relayout(this.htmlComponent, {
				width: 0.9 * widget.style.width,
				height: 0.9 * widget.style.height,
			});

		});

		const evt = window.document.createEvent('UIEvents');
		evt.initUIEvent('resize', true, false, window, 0);
		window.dispatchEvent(evt);

	}

	init() {

		this.config.staticPlot = true;
		this.config.responsive = true;
		this.config.displaylogo = false;
		this.config.format = 'png';
		this.config.type = 'scatter';

		Plotly.newPlot(this.htmlComponent, this.data, this.layout, this.config);
		this.setAutoResize();

	}

};