const Container = require('../../../../../../formBuilder/formBuilder').Container;
const Field = require('../../../../../../formBuilder/formBuilder').Field;
const Validator = require('../../../../../../formBuilder/validator');
const Components = require('../../../../../../components');
const EventHandler = require('../../../../../../eventHandler/eventHandler');

module.exports = class PlotlyScatter {

	constructor() {

		this.eventHandler = new EventHandler();

		this.form = Container.div({
			PlotlySeries: Container.spliter({
				newSerieName: Field.text({
					att: 'name',
					validators: [Validator.isFilled, Validator.noSpecialChars],
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
			PlotlySeriesStyle: Container.spliter({
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
						markersColor: Field.select({
							label: 'Cor',
							att: 'color',
							classList: ['col-6'],
							options: [
								{
									text: '#1f77b4',
								},
								{
									text: '#ff7f0e',
								},
								{
									text: '#2ca02c',
								},
								{
									text: '#d62728',
								},
								{
									text: '#9467bd',
								},
								{
									text: '#8c564b',
								},
								{
									text: '#e377c2',
								},
								{
									text: '#7f7f7f',
								},
								{
									text: '#bcbd22',
								},
								{
									text: '#17becf',
								},
							],
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
						lineColor: Field.select({
							label: 'Cor',
							att: 'color',
							classList: ['col-6'],
							options: [
								{
									text: '#1f77b4',
								},
								{
									text: '#ff7f0e',
								},
								{
									text: '#2ca02c',
								},
								{
									text: '#d62728',
								},
								{
									text: '#9467bd',
								},
								{
									text: '#8c564b',
								},
								{
									text: '#e377c2',
								},
								{
									text: '#7f7f7f',
								},
								{
									text: '#bcbd22',
								},
								{
									text: '#17becf',
								},
							],
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
			}),
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

		this.form.formThree.PlotlySeries.xAxis.setOptions(window.CurrentInputGroup.inputs, callBack);
		this.form.formThree.PlotlySeries.yAxis.setOptions(window.CurrentInputGroup.inputs, callBack);

	}

	addNewTrace() {

		window.CurrentBlock.sendBlockInstruction({

			command: 'addTrace',
			data: {
				name: this.form.formThree.PlotlySeries.newSerieName.value,
				mode: 'lines+markers',
				line: {
					width: '3',
					dash: 'solid',
					shape: 'linear',
				},
				marker: {
					size: '5',
				},
			},
		});

	}

	init() {

		this.eventHandler.addEventListener('AttInputList', () => {

			this.attXandYInputList();

		});

		this.form.formThree.PlotlySeries.self.htmlComponent.addEventListener('input', (evt) => {

			evt.stopPropagation();

		});

		this.form.formThree.PlotlySeries.newSerieName.append[0].onclick = () => {

			if (this.form.formThree.PlotlySeries.self.validate()) {

				this.addNewTrace();

			}

		};

		this.eventHandler.addEventListener('BlockWasSelected', (evt) => {

			if (evt.block.formConfig.type === 'Plotly' && evt.block.formConfig.Plotly.type === 'scatter') {

				console.log('ok');

			}

		});

	}

};