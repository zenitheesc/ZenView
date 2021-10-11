/* eslint-disable new-cap */
const Block = require('../block');
const uPlot = require('uplot');
const { v4: uuidv4 } = require('uuid');
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
		if (this.opt.series[1].inputName == null) {
			this.data.pop();
			this.opt.series.pop();
		}

		this.opt.series.push({
			...newSerie,
			uuid: uuidv4(),
			paths: this.pathSetter("1"),
		});

		const newMockData = [...Array(11).keys()].map((value) => (Math.sin(value) + (this.opt.series.length - 2)));
		if (this.opt.series.length > this.data.length) this.data.push(newMockData);

		this.redraw();

	}

	editXAxis(newConfig) {

		this.opt.series[0].inputName = newConfig.inputName;
		this.opt.series[0].label = newConfig.inputName;

		this.opt.scales.x.distr = newConfig.type;
		this.opt.scales.x.dir = newConfig.dir;
		this.opt.axes[0].side = Number(newConfig.side);
		console.log(newConfig);
		this.redraw();
	}

	editYAxis(newConfig) {

		console.log(newConfig);

		this.plot.scales.y.distr = newConfig.type;

		this.opt.scales.y.dir = newConfig.dir;

		this.opt.axes[1].side = Number(newConfig.side);

		this.redraw();

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

	removeSerie(rmvdSerie) {

		let currSerie = this.opt.series.find(serie => serie.uuid === rmvdSerie.currSerieId);
		let index = this.opt.series.indexOf(currSerie);

		if (index >= 0) {

			if (this.opt.series.length === 2) {
				this.data = [[...Array(11).keys()], []];
				this.opt.series.push();
				this.opt.series.splice(index + 1, 1);

				const newMockData = [...Array(11).keys()].map((value) => (Math.sin(value) + (this.opt.series.length - 2)));
				if (this.opt.series.length > this.data.length) this.data.push(newMockData);
			} else {
				this.opt.series.splice(index, 1);
				this.data.pop();
			}


		}

		this.redraw();
	}

	editSerie(newConfig) {

		let currSerie = this.opt.series.find(serie => serie.uuid === newConfig.currSerieId);
		let index = this.opt.series.indexOf(currSerie);

		this.opt.series[index] = {
			label: newConfig.label,
			width: newConfig.width,
			pathType: newConfig.pathType,
			showLines: newConfig.showLines,
			uuid: newConfig.currSerieId,
			points: {
				show: newConfig.points.showPoints,
				showPoints: newConfig.points.showPoints,
			},
			inputName: newConfig.inputName,
			stroke: newConfig._stroke,
			paths: this.pathSetter((!newConfig.showLines) ? null : newConfig.pathType),
		};

		this.redraw();

		return this.opt.series[index];

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

	redraw() {
		this.plot.destroy();

		this.plot = new uPlot(this.opt, this.data, this.htmlComponent);
		this.htmlComponent.parentElement.dispatchEvent(new Event('resize'));
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
