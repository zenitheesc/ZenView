/* eslint-disable new-cap */
const Block = require('../block');
const uPlot = require('uplot');
const { v4: uuidv4 } = require('uuid');
const ZoomWheelPlugin = require('./plugins/zoom-wheel');
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

		this.opt.plugins = [
			ZoomWheelPlugin({ factor: 0.75 })
		]
	}

	get formConfig() {

		const response = {
			axes: {
				x: {
					dir: this.opt.scales.x.dir,
					inputName: this.opt.series[0].label,
					side: this.opt.axes[0].side,
				},
				y: {
					dir: this.opt.scales.y.dir,
					side: this.opt.axes[1].side,
					type: this.opt.scales.y.distr
				}
			}
		}

		this._formConfig.uPlot.scatter = { ...response };
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

	addSerie(newSerie, notRedraw) {
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

		if (!notRedraw) this.redraw();

		this.opt.scales.x.range = undefined;
		this.opt.scales.y.range = undefined;

	}

	editXAxis(newConfig) {

		this.opt.series[0].inputName = newConfig.inputName;
		this.opt.series[0].label = newConfig.inputName;

		this.opt.scales.x.dir = Number(newConfig.dir);
		this.opt.axes[0].side = Number(newConfig.side);
		this.redraw();
	}

	editYAxis(newConfig) {

		this.opt.scales.y.distr = newConfig.type;

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
				this.data[i] = this.data[i].slice(-100)
			}

			this.plot.setData(this.data);

		});
	}

	removeSerie(rmvdSerie) {

		let currSerie = this.opt.series.find(serie => serie.uuid === rmvdSerie.uuid);
		let index = this.opt.series.indexOf(currSerie);

		if (index >= 0) {

			if (this.opt.series.length === 2) {
				this.opt.series.splice(1, 1);
				this.opt.series.push({});
			} else {
				this.opt.series.splice(index, 1);
				this.data.pop();
			}

		}
		this.redraw();
	}

	editSerie(newConfig, notRedraw) {
		let currSerie = this.opt.series.find(serie => serie.uuid === newConfig.uuid);
		let index = this.opt.series.indexOf(currSerie);

		this.opt.series[index] = {
			label: newConfig.inputName,
			width: newConfig.width,
			pathType: newConfig.pathType,
			showLines: newConfig.showLines,
			uuid: newConfig.uuid,
			points: {
				show: newConfig?.points?.showPoints ?? false,
				showPoints: newConfig?.points?.showPoints ?? false,
			},
			inputName: newConfig.inputName,
			stroke: newConfig._stroke ?? newConfig.stroke,
			_stroke: newConfig._stroke ?? newConfig.stroke,
			paths: this.pathSetter((!newConfig.showLines) ? null : newConfig.pathType),
		};

		if (!notRedraw) this.redraw();

		return this.opt.series[index];

	}

	setAutoResize() {

		const widget = this.htmlComponent;

		addResizeListener(widget, () => {
			this.plot.setSize({
				width: widget.offsetWidth,
				height: widget.offsetHeight * 0.8,
			});

			this.redraw();

		});

	}

	redraw() {
		this.plot.destroy();
		const widget = this.htmlComponent.parentElement;

		this.plot = new uPlot(this.opt, this.data, this.htmlComponent);

		this.plot.setSize({
			width: widget.offsetWidth,
			height: widget.offsetHeight * 0.8,
		});
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

	willRead() {
		this.data = [[], []];
		this.redraw();
	}

	save() {
		return {
			data: this.data,
			opt: this.opt,
		}

	}

	load(preSavedConfig) {

		this.data = preSavedConfig.data;
		this.opt = preSavedConfig.opt;
		this.opt.plugins = [
			ZoomWheelPlugin({ factor: 0.75 })
		]
		this.plot = new uPlot(this.opt, this.data, this.htmlComponent);

		for (let i = 0; i < this.opt.series.length; i++) {
			this.editSerie(this.opt.series[i]);
		}
		this.setAutoResize();
		this.redraw();

	}

};
