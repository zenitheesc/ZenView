const Container = require('../../../../../../formBuilder/formBuilder').Container;
const Field = require('../../../../../../formBuilder/formBuilder').Field;
const Validator = require('../../../../../../formBuilder/validator');
const Components = require('../../../../../../components');
const EventHandler = require('../../../../../../eventHandler/eventHandler');

module.exports = class PlotlyScatter {

	constructor() {

		this.eventHandler = new EventHandler();

		this.styleSection = Container.spliter({
			selectedSerie: Field.select({
				att: 'currTraceName',
				label: 'Série',
			}),
			showMarkers: Field.checkBox({
				label: 'Pontos',
				att: 'showMarkers',
				id: 'PlotlyScatterShowMarkers',
			}),
			markersOptions: Container.div({
				markerStyle: Container.formRow({
					markersSize: Field.select(
						{
							label: 'Tamanho',
							att: 'size',
							classList: ['col-6'],
							options: [
								{
									text: 4,
								},
								{
									text: 6,
								},
								{
									text: 8,
								},
								{
									text: 10,
								},
								{
									text: 12,
								},
								{
									text: 14,
								},
							],
						},
					),
					markersColor: Field.colorPicker({
						label: 'Cor',
						att: 'color',
						classList: ['col-6'],
					}),
				}),
			}, {
				att: 'marker',
				conditions: [
					{
						id: 'PlotlyScatterShowMarkers',
						att: 'checked',
						requiredValue: true,
					},
				],
			}),
			showLines: Field.checkBox({
				label: 'Linhas',
				att: 'showLines',
				id: 'PlotlyScatterShowLines',
			}),
			lineOptions: Container.div({
				linStyle: Container.formRow({
					lineWidth: Field.select(
						{
							label: 'Tamanho',
							att: 'width',
							classList: ['col-6'],
							options: [
								{
									text: 4,
								},
								{
									text: 6,
								},
								{
									text: 8,
								},
								{
									text: 10,
								},
								{
									text: 12,
								},
								{
									text: 14,
								},
							],
						},
					),
					lineColor: Field.colorPicker({
						label: 'Cor',
						att: 'color',
						classList: ['col-6'],
					}),
				}),
				lineOption: Container.formRow({
					lineDash: Field.select(
						{
							label: 'Tracejado',
							att: 'dash',
							classList: ['col-6'],
							options: [
								{
									text: 'Sólido',
									value: 'solid',
								},
								{
									text: 'Pontilhado',
									value: 'dot',
								},
								{
									text: 'Tracejado',
									value: 'dash',
								},
								{
									text: 'Travessão',
									value: 'longdash',
								},
								{
									text: 'Traço e ponto',
									value: 'dashdot',
								},
							],
						},
					),
					lineShape: Field.select({
						label: 'Interpolação',
						att: 'shape',
						classList: ['col-6'],
						options: [
							{
								text: 'Linear',
								value: 'linear',
							},
							{
								text: 'Suave',
								value: 'spline',
							},
							{
								text: 'Degraus 1',
								value: 'hv',
							},
							{
								text: 'Degraus 2',
								value: 'vh',
							},
							{
								text: 'Degraus 3',
								value: 'hvh',
							},
							{
								text: 'Degraus 4',
								value: 'vhv',
							},
						],
					}),
				}),
			}, {
				att: 'line',
				conditions: [
					{
						id: 'PlotlyScatterShowLines',
						att: 'checked',
						requiredValue: true,
					},
				],
			}),
		}, {
			startOpen: false,
			att: 'trace',
			text: 'Estilo',
			id: 'PlotlySeriesStyle',
		});

		this.form = Container.div({
			PlotlySeries: Container.spliter({
				newSerieName: Field.text({
					att: 'name',
					validators: [Validator.isFilled, Validator.noSpecialChars, this.nameAlreadyExist],
					append: [
						{
							type: 'button',
							content: Components.icon('plus-square'),
							classList: ['formButtonWithIconPrepend'],
						},
					],
				}),
				xAxis: Field.select({
					att: 'x',
					prepend: [
						{
							type: 'text',
							text: 'X',
							classList: ['formTextPrepend'],
						},
					],
				}),
				yAxis: Field.select({
					att: 'y',
					prepend: [
						{
							type: 'text',
							text: 'Y',
							classList: ['formTextPrepend'],
						},
					],
				}),
			}, {
				startOpen: false,
				att: 'newTrace',
				text: 'Series',
				id: 'PlotlySeries',
			}),
			PlotlySeriesStyle: this.styleSection,
			plotlyXAxesStyle: Container.spliter({
				xAxesTitle: Field.text({
					att: 'title.text',
					label: 'Título',
				}),
				xAxesStyle: Field.select({
					label: 'Tamanho',
					att: 'title.font.size',
					options: [
						{
							text: 10,
						},
						{
							text: 12,
						},
						{
							text: 14,
						},
						{
							text: 16,
						},
						{
							text: 18,
						},
						{
							text: 20,
						},
					],
				}),
				xAxesScale: Field.select({
					label: 'Escala',
					att: 'type',
					options: [
						{
							text: 'Linear',
							value: 'linear',
						},
						{
							text: 'Logaritimica',
							value: 'log',
						},
					],
				}),
			}, {
				att: '../layout.xaxis',
				startOpen: false,
				text: 'Eixo X',
				id: 'plotlyXAxeStyle',
			}),
			plotlyYAxesStyle: Container.spliter({
				yAxesTitle: Field.text({
					att: 'title.text',
					label: 'Título',
				}),
				yAxesStyle: Field.select({
					att: 'title.font.size',
					label: 'Tamanho',
					options: [
						{
							text: 10,
						},
						{
							text: 12,
						},
						{
							text: 14,
						},
						{
							text: 16,
						},
						{
							text: 18,
						},
						{
							text: 20,
						},
					],
				}),
				yAxesScale: Field.select({
					att: 'type',
					label: 'Escala',
					options: [
						{
							text: 'Linear',
							value: 'linear',
						},
						{
							text: 'Logaritimica',
							value: 'log',
						},
					],
				}),
			}, {
				att: '../layout.yaxis',
				startOpen: false,
				text: 'Eixo Y',
				id: 'plotlyYAxeStyle',
			}),
		}, {
			id: 'PlotlyScatterConfig',
			att: 'scatter',
			conditions: [
				{
					id: 'plotlyTypeSelector',
					att: 'value',
					requiredValue: 'scatter',
				},
			],
		},
		);

		this.init();

	}

	attXandYInputList() {

		const callBack = (input) => {

			return [input.name, input.name];

		};

		let allInputs = [];

		allInputs = allInputs.concat(window.CurrentInputGroup.rawInputs);
		allInputs = allInputs.concat(window.CurrentInputGroup.inputs);

		this.form.formTree.PlotlySeries.xAxis.setOptions(allInputs, callBack);
		this.form.formTree.PlotlySeries.yAxis.setOptions(allInputs, callBack);

	}

	nameAlreadyExist(currentSerieName) {

		for (let i = 0; i < window.CurrentBlock.block.data.length; i++) {

			if (window.CurrentBlock.block.data[i].name === currentSerieName) {

				return 'Esse nome já existe';

			}

		}

		return true;

	}

	addNewTrace() {

		window.CurrentBlock.sendBlockInstruction({

			command: 'addTrace',
			data: {
				name: this.form.formTree.PlotlySeries.newSerieName.value,
				mode: 'lines+markers',
				xInput: this.form.formTree.PlotlySeries.xAxis.value,
				yInput: this.form.formTree.PlotlySeries.yAxis.value,
			},
		});

		this.form.formTree.PlotlySeries.newSerieName.value = '';

	}

	editTrace() {

		window.CurrentBlock.sendBlockInstruction({

			command: 'editTrace',
			data: this.styleSection.getData(),

		});

	}

	attStyleSection() {

		const currentSerieName = this.styleSection.formTree.selectedSerie.value;
		const currentSerie = this.setTraceType(this.getTraceByName(currentSerieName));

		this.styleDataSetter(currentSerie);

		this.styleSection.setConditions();


	}

	attSeriesSelector() {

		const callBack = (trace) => {

			return [trace.name, trace.name];

		};

		this.form.formTree.PlotlySeriesStyle.selectedSerie.setOptions(window.CurrentBlock.block.data, callBack);

	}

	setEvents() {

		this.eventHandler.addEventListener('AttInputList', () => {

			this.attXandYInputList();

		});

		this.form.formTree.PlotlySeries.self.htmlComponent.addEventListener('input', (evt) => {

			evt.stopPropagation();

		});

		this.styleSection.formTree.selectedSerie.htmlComponent.addEventListener('input', (evt) => {

			this.attStyleSection();
			evt.stopPropagation();

		});

		this.styleSection.htmlComponent.addEventListener('input', (evt) => {

			this.editTrace();
			evt.stopPropagation();

		});


	}

	getTraceByName(serieName) {

		let currentSerie;

		for (let i = 0; i < window.CurrentBlock.block.data.length; i++) {

			if (window.CurrentBlock.block.data[i].name === serieName) {

				currentSerie = window.CurrentBlock.block.data[i];
				break;

			}

		}

		return currentSerie;

	}

	setTraceType(currentSerie) {

		if (!currentSerie) {

			return currentSerie = {
				showMarkers: false,
				showLines: false,
			};

		};

		if (currentSerie.mode === 'lines+markers' || currentSerie.mode === undefined) {

			currentSerie.showMarkers = true;
			currentSerie.showLines = true;

		} else if (currentSerie.mode === 'markers') {

			currentSerie.showMarkers = true;
			currentSerie.showLines = false;

		} else {

			currentSerie.showLines = true;
			currentSerie.showMarkers = false;
			if (currentSerie.visible == false) {

				currentSerie.showLines = false;

			}

		}

		return currentSerie;

	}

	styleDataSetter(currentSerie) {

		const wrapper = {};
		wrapper['Plotly.scatter.trace'] = currentSerie;

		this.styleSection.containers.forEach((container) => {

			container.setData(wrapper);

		});

		wrapper['form.Plotly.scatter.trace'] = currentSerie;
		const atts = this.styleSection.objToPathList(wrapper);

		this.styleSection.fields.forEach((field) => {


			if (atts[field.att] !== undefined) {

				field.value = atts[field.att];

			}

		});

	}

	init() {

		this.setEvents();

		this.form.formTree.PlotlySeries.newSerieName.append[0].onclick = () => {

			if (this.form.formTree.PlotlySeries.self.validate()) {

				this.addNewTrace();
				this.attSeriesSelector();
				if (window.CurrentBlock.block.data.length <= 1) this.attStyleSection();


			}

		};

		this.styleSection.setData = () => {

			this.attSeriesSelector();

			const currentSerieName = this.styleSection.formTree.selectedSerie.value;
			const currentSerie = this.setTraceType(this.getTraceByName(currentSerieName));

			this.styleDataSetter(currentSerie);

		};

	}

};