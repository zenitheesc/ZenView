const Container = require('../../../../../../formBuilder/formBuilder').Container;
const Field = require('../../../../../../formBuilder/formBuilder').Field;
const Validator = require('../../../../../../formBuilder/validator');
const Components = require('../../../../../../components');
const EventHandler = require('../../../../../../eventHandler/eventHandler');

module.exports = class uPlotScatter {

	constructor() {

		this.eventHandler = new EventHandler();

		this.seriesSection = Container.spliter({
			xAxis: Field.select({
				att: 'x',
				label: "Eixo x",
				prepend: [
					{
						type: 'text',
						text: 'X',
						classList: ['formTextPrepend'],
					},
				],
			}),
			selectedSerie: Field.select({
				att: 'currTraceName',
				label: 'Séries',
				append: [
					{
						type: 'button',
						content: Components.icon('plus-square'),
						classList: ['formButtonWithIconPrepend'],
					},
				],
			}),
			currSerie: Field.text({
				att: 'currTraceNewName',
				label: 'Nome',
			}),
			yAxis: Field.select({
				att: 'y',
				label: 'Dados',
				prepend: [
					{
						type: 'text',
						text: 'Y',
						classList: ['formTextPrepend'],
					},
				],
			}),
			showMarkers: Field.checkBox({
				label: 'Pontos',
				att: 'showMarkers',
				id: 'uPlotScatterShowMarkers',
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
						id: 'uPlotScatterShowMarkers',
						att: 'checked',
						requiredValue: true,
					},
				],
			}),
			showLines: Field.checkBox({
				label: 'Linhas',
				att: 'showLines',
				id: 'uPlotScatterShowLines',
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
						id: 'uPlotScatterShowLines',
						att: 'checked',
						requiredValue: true,
					},
				],
			}),
		}, {
			startOpen: false,
			att: 'trace',
			text: 'Séries',
			id: 'uPlotSeriesStyle',
		});

		this.form = Container.div({
			uPlotSeriesStyle: this.seriesSection,
			uPlotXAxesStyle: Container.spliter({
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
				scaleOpts: Container.formRow({
					xAxesDirection: Field.select(
						{
							label: 'Tamanho',
							att: 'size',
							classList: ['col-6'],
							options: [
								{
									text: "crescente",
								},
								{
									text: "decrescente",
								},
							],
						},
					),
					xAxesPos: Field.select(
						{
							label: 'Posição',
							att: 'size',
							classList: ['col-6'],
							options: [
								{
									text: 'top',
								},
								{
									text: 'bottom',
								},
							],
						},
					),
				}),
			}, {
				att: '../layout.xaxis',
				startOpen: false,
				text: 'Eixo X',
				id: 'uPlotXAxeStyle',
			}),
			uPlotYAxesStyle: Container.spliter({
				yAxesScale: Field.select({
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
				scaleOpts: Container.formRow({
					yAxesDirection: Field.select(
						{
							label: 'Tamanho',
							att: 'size',
							classList: ['col-6'],
							options: [
								{
									text: "crescente",
								},
								{
									text: "decrescente",
								},
							],
						},
					),
					yAxesPos: Field.select(
						{
							label: 'Posição',
							att: 'size',
							classList: ['col-6'],
							options: [
								{
									text: 'direita',
								},
								{
									text: 'esquerda',
								},
							],
						},
					),
				}),
			}, {
				att: '../layout.xaxis',
				startOpen: false,
				text: 'Eixo Y',
				id: 'uPlotYAxeStyle',
			}),
		}, {
			id: 'uPlotScatterConfig',
			att: 'scatter',
			conditions: [
				{
					id: 'uPlotTypeSelector',
					att: 'value',
					requiredValue: 'scatter',
				},
			],
		},
		);

		this.setEvents();

	}

	attXandYInputList() {

		const callBack = (input) => {

			return [input.name, input.name];

		};

		let allInputs = [];

		allInputs = allInputs.concat(window.CurrentInputGroup.rawInputs);
		allInputs = allInputs.concat(window.CurrentInputGroup.inputs);

		this.seriesSection.formThree.xAxis.setOptions(allInputs, callBack);
		this.seriesSection.formThree.yAxis.setOptions(allInputs, callBack);

	}

	addNewTrace() {

		window.CurrentBlock.sendBlockInstruction({

			command: 'addTrace',
			data: {
				label: "série " + this.seriesSection.formThree.selectedSerie.input.options.length,
			},
		});

	}

	setEvents() {

		this.eventHandler.addEventListener('AttInputList', () => {

			this.attXandYInputList();

		});

		this.seriesSection.formThree.selectedSerie.append[0].onclick = () => {

			if (this.seriesSection.validate()) {

				this.addNewTrace();
			}

		};

		this.seriesSection.formThree.selectedSerie.htmlComponent.addEventListener('input', (evt) => {

			this.attseriesSection();
			evt.stopPropagation();

		});

		this.seriesSection.htmlComponent.addEventListener('input', (evt) => {

			this.editTrace();
			evt.stopPropagation();

		});


	}

};