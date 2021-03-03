const Block = require('../block');
const Plotly = require('plotly.js');
// eslint-disable-next-line no-unused-vars
const ElementResize = require('javascript-detect-element-resize');
const loadash = require('lodash');
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

		this.colors = ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564D', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF'];
		this.colorCount = 0;

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

		x.sort((a, b) => a - b);


		Plotly.addTraces(this.htmlComponent, {
			name: newTrace.name,
			x: x,
			y: y,
			xInput: newTrace.xInput,
			yInput: newTrace.yInput,
			mode: newTrace.mode,
			line: {
				width: 4,
				dash: 'solid',
				shape: 'linear',
				color: String([this.colors[this.colorCount]]),
			},
			marker: {
				size: 6,
				color: String([this.colors[this.colorCount]]),
			},

		});

		this.colorCount = (this.colorCount + 1) % this.colors.length;
		Plotly.update(this.htmlComponent);

	}

	updateConfig(newConfig) {

		this.formConfig = newConfig;
		newConfig = newConfig.Plotly;
		if (newConfig !== undefined) this.attConfig(newConfig.config);
		if (newConfig !== undefined) this.attLayout(newConfig.layout);

	}

	updateData(newData) {

		const newXdata = this.data.map((trace) => [newData[trace.xInput]]);
		const newYdata = this.data.map((trace) => [newData[trace.yInput]]);
		const indices = [...this.data.keys()];

		Plotly.extendTraces(this.htmlComponent, {
			x: newXdata,
			y: newYdata,
		}, indices, 200);

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

			} else if (!newData['showMarkers'] && !newData['showLines']) {

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

		this.config = newConfig;

	}

	setAutoResize() {

		const widget = this.htmlComponent.parentElement.parentElement;
		this.htmlComponent.firstChild.classList.add('h-100');

		addResizeListener(widget, () => {

			Plotly.relayout(this.htmlComponent, {
				width: widget.style.width,
				height: widget.style.height,
			});

		});

		const evt = window.document.createEvent('UIEvents');
		evt.initUIEvent('resize', true, false, window, 0);
		window.dispatchEvent(evt);

	}

	init() {

		this.config.staticPlot = false;
		this.config.responsive = true;
		this.config.displaylogo = false;
		this.config.format = 'png';
		this.config.type = 'scatter';
		this.config.scrollZoom = true;

		Plotly.newPlot(this.htmlComponent, this.data, this.layout, this.config);
		this.setAutoResize();

	}

};