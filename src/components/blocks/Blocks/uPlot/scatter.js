/* eslint-disable new-cap */
const Block = require('../block');
const uPlot = require('uplot');
// eslint-disable-next-line no-unused-vars
const ElementResize = require('javascript-detect-element-resize');

module.exports = class Scatter extends Block {

	constructor(preConfig, htmlComponent) {

		super(preConfig, htmlComponent);
		this._formConfig = preConfig;
		this.data = preConfig.uPlot.data ?? [[...Array(11).keys()], []];
		this.opt = preConfig.uPlot.opt;
		this.type = preConfig.type;
		this.series = preConfig.series;
		this.initR = false;
		this.type = "uPlot";
		this.cont = 0;

	}

	get formConfig() {

		return this._formConfig

	}

	pathSetter(pathType) {

		switch (pathType) {
			case "1":
				return uPlot.paths.linear()
				break;
			case "2":
				return uPlot.paths.spline()
				break;
			case "3":
				return uPlot.paths.stepped({ align: -1 })
				break;
			case "4":
				return uPlot.paths.stepped({ align: 1 })
				break;
			default:
				return () => null;
				break;
		}

	}

	addSerie(newSerie) {

		this.plot.addSeries({
			...newSerie,
			paths: this.pathSetter("1"),
		}, this.data.length);

		if (this.plot.series[1].inputName == null) {
			this.plot.delSeries(1);
			this.data.pop();
		}

		const newMockData = [...Array(11).keys()].map((value) => (Math.sin(value) + (this.plot.series.length - 2)));
		if (this.plot.series.length > this.data.length) this.data.push(newMockData);

		this.plot.setData(this.data);

	}

	updateConfig(newConfig) {

		newConfig = newConfig[newConfig.type];

		this.attLayout(newConfig.axis);
		this.editSerie(newConfig.series);

	}

	editXAxis(newConfig) {

		this.plot.addSeries({
			inputName: newConfig,
			label: newConfig,
		}, 0)

		this.plot.delSeries(1);
		this.plot.setData(this.data);

	}

	updateData(newData) {

		requestAnimationFrame(() => {

			if (!this.initR) {

				for (let i = 0; i < this.plot.series.length; i++) {
					this.data[i] = [];
				}

				this.initR = true;
			}

			for (let i = 0; i < this.plot.series.length; i++) {
				this.data[i].push(newData[this.plot.series[i].inputName])
				this.data[i] = this.data[i].slice(-200)
			}

			this.plot.setData(this.data);

		});
	}

	rmvSerie(rmvdSerie) {

		let index = -1;

		for (const serie of this.plot.series) {

			if (serie.label === rmvdSerie.label) {

				index = this.plot.series.indexOf(serie);
				break;

			}

		}

		if (index >= 0) {

			if (this.plot.series.length === 2) {
				this.data = [[...Array(11).keys()], []];
				this.plot.addSeries({}, 1);
				this.plot.delSeries(index + 1);

				const newMockData = [...Array(11).keys()].map((value) => (Math.sin(value) + (this.plot.series.length - 2)));
				if (this.plot.series.length > this.data.length) this.data.push(newMockData);
			} else {
				this.plot.delSeries(index);
				this.data.pop();
			}


		}

		this.plot.setData(this.data)

	}

	editSerie(newConfig, chageName) {
		
		let index = -1;

		for (const serie of this.plot.series) {

			if (serie.label === newConfig.currSerie) {

				index = this.plot.series.indexOf(serie);
				break;

			}

		}

		this.plot.addSeries({
			label: (chageName) ? newConfig.label : this.plot.series[index].label,
			width: newConfig.width,
			pathType: newConfig.pathType,
			showLines: newConfig.showLines,
			points: {
				show: newConfig.points.showPoints,
				showPoints: newConfig.points.showPoints,
			},
			inputName: newConfig.inputName,
			stroke: newConfig._stroke,
			paths: this.pathSetter((!newConfig.showLines) ? null : newConfig.pathType),
		}, index);

		this.plot.delSeries(index + 1);
		this.plot.redraw();

	}

	attLayout(newLayout) {


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

	renameSerie(newConfig) {

		this.editSerie(newConfig, true)

	}

	destroy() {

		this.plot.destroy();

	}

	init() {

		this.opt.series[0].label = window.CurrentInputGroup.rawInputs[0].name;
		this.opt.series[0].inputName = window.CurrentInputGroup.rawInputs[0].name;
		this.plot = new uPlot(this.opt, this.data, this.htmlComponent);
		this.setAutoResize();

	}

	save() {
		return {
			data: this.plot.data,
			series: JSON.parse(JSON.stringify(this.plot.series)),
			opt: this.opt,
		}
	}

	load(preSavedConfig) {

		this.data = preSavedConfig.data;
		this.opt = preSavedConfig.opt;
		this.series = preSavedConfig.series;
		this.opt.series = [];

		for (const savedSerie of this.series) {

			this.opt.series.push({
				label: savedSerie.label,
				width: savedSerie.width,
				pathType: savedSerie.pathType,
				showLines: savedSerie.showLines,
				points: {
					show: savedSerie.points.showPoints,
					showPoints: savedSerie.points.showPoints,
				},
				inputName: savedSerie.inputName,
				stroke: savedSerie._stroke,
				paths: this.pathSetter((!savedSerie.showLines) ? null : savedSerie.pathType),
			});
		}

		this.plot = new uPlot(this.opt, this.data, this.htmlComponent);

		this.setAutoResize();

	}

};
