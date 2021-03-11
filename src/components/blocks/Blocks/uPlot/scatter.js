/* eslint-disable new-cap */
const Block = require('../block');
const uPlot = require('uplot');
// eslint-disable-next-line no-unused-vars
const ElementResize = require('javascript-detect-element-resize');
const { sum } = require('mathjs');

module.exports = class Scatter extends Block {

	constructor(preConfig, htmlComponent) {

		super(preConfig, htmlComponent);
		this.formConfig = preConfig;
		this.data = preConfig.uPlot.data ?? [[...Array(11).keys()], {}];
		this.opt = preConfig.uPlot.opt;
		preConfig = preConfig.uPlot;
	}

	selectColor(colorNumber) {
		const colors = [
			"red", "green", "blue", "orange"
		]

		return colors[colorNumber % colors.length];
	}

	addTrace(newTrace) {

		const newMockData = [[...Array(11).keys()].map((value) => (Math.sin(value) + (this.data.length-2)))];

		this.plot.addSeries({
			spanGaps: false,
			label: newTrace.label,
			width: 3,
			stroke: this.selectColor(this.data.length - 1),
		}, this.data.length);

		this.data = (this.plot.series.length > this.data.length) ? this.data.concat(newMockData) : this.data;

		this.plot.setScale('y',{min:-2,max:this.data.length});
	    this.plot.setData(this.data);

	}

	updateConfig(newConfig) {

	}

	updateData(newData) {

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

	setAutoResize() {

		const widget = this.htmlComponent.parentElement;

		addResizeListener(widget, () => {

			this.plot.setSize({
				width: widget.offsetWidth,
				height: widget.offsetHeight * 0.8,
			});

		});

	}

	init() {

		this.plot = new uPlot(this.opt, this.data, this.htmlComponent);
		this.setAutoResize();

	}

};