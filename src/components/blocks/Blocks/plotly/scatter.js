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

		this.config = (preConfig.config) ? preConfig.config : {};
		this.layout = (preConfig.layout) ? preConfig.layout : {};
		this.data = (preConfig.data) ? preConfig.data : [];
		this.traces = [];

	}

	addTrace(newTrace) {

		this.traces.push(newTrace);

		let x = [];
		let y = [];
		console.log(this.data);
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
		//if (newConfig !== undefined) this.attData(newConfig.data);

	}

	rmvTrace() {

	}

	attData(newData) {

		let i = 0;
		let found = false;

		for (i = 0; i < this.data.length; i++) {

			if (this.data[i].name === newData.currentSerieName) {

				found = true;
				break;

			}

		}

		if (found) {

			if (newData['showmarkers'] && newData['showlines']) {

				newData.mode = 'lines+markers';
				newData.visible = true;

			} else if (newData['showmarkers'] && !newData['showlines']) {

				newData.mode = 'markers';
				newData.visible = true;

			} else if (!newData['showmarkers'] && newData['showlines']) {

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