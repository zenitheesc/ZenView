const Block = require('../block');
const Plotly = require('plotly.js');
const loadash = require('lodash');
// eslint-disable-next-line no-unused-vars
const ElementResize = require('javascript-detect-element-resize');

module.exports = class Scatter extends Block {

	constructor(preConfig) {

		super();
		this.id = 'PlotlyScatter';
		this.formConfig = preConfig;
		this.type = preConfig.type;
		preConfig = preConfig.Plotly;

		preConfig.config = (preConfig.config) ? preConfig.config : {};
		preConfig.layout = (preConfig.layout) ? preConfig.layout : {};
		preConfig.data = (preConfig.data) ? preConfig.data : [];

		this.config = preConfig.config;
		this.layout = preConfig.layout;
		this.data = preConfig.data;

	}

	instructionHandler(instruction) {

		switch (instruction.command) {

			case 'addTrace':

				this.addTrace(instruction.data);

				break;
			case 'rmvTrace':

				this.rmvTrace(instruction.data);
				break;
			case 'editTrace':

				this.editTrace(instruction.data);

				break;
			default:
				break;

		}

	}

	addTrace(newTrace) {

		const x = [];
		const y = [];

		for (let i = 0; i < 10; i++) {

			x[i] = Math.floor(i * 3);
			y[i] = Math.floor(100 * (Math.random()) % 20);

		}

		x.sort((a, b) => {

			return a - b;

		});

		Plotly.addTraces(this.htmlComponent, {
			name: newTrace.name,
			x: x,
			y: y,
			mode: newTrace.mode,
			line: newTrace.line,
			marker: newTrace.marker,

		});


		Plotly.update(this.htmlComponent);

	}

	updateConfig(newConfig) {

		this.formConfig = newConfig;
		newConfig = newConfig.Plotly;
		if (newConfig !== undefined) this.attConfig(newConfig.config);
		if (newConfig !== undefined) this.attLayout(newConfig.layout);

	}

	rmvTrace() {

	}

	editTrace(newData) {

		newData = newData.Plotly.scatter.trace;

		let i = 0;
		let found = false;

		for (i = 0; i < this.data.length; i++) {

			if (this.data[i].name === newData.currTraceName) {

				found = true;
				break;

			}

		}

		if (found) {

			if (newData['showMarkers'] && newData['showLines']) {

				newData.mode = 'lines+markers';
				newData.visible = true;

			} else if (newData['showMarkers'] && !newData['showLines']) {

				newData.mode = 'markers';
				newData.visible = true;

			} else if (!newData['showMarkers'] && newData['showLines']) {

				newData.mode = 'lines';
				newData.visible = true;

			} else if (!newData['showmarkers'] && !newData['showlines']) {

				newData.visible = false;

			}

			Plotly.restyle(this.htmlComponent, newData, i);

		}

	}

	attLayout(newLayout) {

		this.layout = loadash.merge(this.layout, newLayout);
		Plotly.relayout(this.htmlComponent, this.layout);

	}

	attConfig(newConfig) {

		this.config = loadash.merge(this.config, newConfig);

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