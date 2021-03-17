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
				att: 'xData',
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
				att: 'currSerie',
				label: 'Séries',
				append: [
					{
						type: 'button',
						content: Components.icon('plus-square'),
						classList: ['formButtonWithIconPrepend'],
					},
					{
						type: 'button',
						content: Components.icon('plus-square'),
						classList: ['formButtonWithIconPrepend'],
					},
				],
			}),
			currSerie: Field.text({
				att: 'label',
				label: 'Nome',
				append: [
					{
						type: 'button',
						content: Components.icon('plus-square'),
						classList: ['formButtonWithIconPrepend'],
					},
				],
			}),
			yAxis: Field.select({
				att: 'yData',
				label: 'Dados',
				prepend: [
					{
						type: 'text',
						text: 'Y',
						classList: ['formTextPrepend'],
					},
				],
			}),
			showPoints: Field.checkBox({
				label: 'Pontos',
				att: 'points.showPoints',
				id: 'uPlotScatterShowMarkers',
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
							],
						},
					),
					lineColor: Field.colorPicker({
						label: 'Cor',
						att: '_stroke',
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
						att: 'pathType',
						classList: ['col-6'],
						options: [
							{
								text: 'Linear',
								value: 1,
							},
							{
								text: 'Suave',
								value: 2,
							},
							{
								text: 'Degraus 1',
								value: 3,
							},
							{
								text: 'Degraus 2',
								value: 4,
							},
						],
					}),
				}),
			}, {
				att: '../series',
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
			att: 'series',
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
				att: 'axis.x',
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
				att: 'axis.y',
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

	selectColor(colorNumber) {
		const colors = [
			'#7EB26D', // 0: pale green
			'#EAB839', // 1: mustard
			'#6ED0E0', // 2: light blue
			'#EF843C', // 3: orange
			'#E24D42', // 4: red
			'#1F78C1', // 5: ocean
			'#BA43A9', // 6: purple
			'#705DA0', // 7: violet
			'#508642', // 8: dark green
			'#CCA300',
		]

		return colors[colorNumber % colors.length];
	}

	addNewTrace() {

		const newSerieName = "série " + this.seriesSection.formThree.selectedSerie.input.options.length;
		const color = this.selectColor(this.seriesSection.formThree.selectedSerie.input.options.length)

		const data = {
			label: newSerieName,
			width: 6,
			paths: 1,
			points: {
				show: true,
				showPoints: true,
			},
			pathType: "1",
			show: true,
			showLines: true,
			stroke: color,
			_stroke: color,
		}

		window.CurrentBlock.sendBlockInstruction({

			command: 'addSerie',
			data,
		});

		this.seriesSection.formThree.selectedSerie.value = newSerieName;
		return data;
	}

	attSeriesSelector(value) {

		const callBack = (trace) => {

			return [trace.label, trace.label];

		};

		let slice = 1;
		if (window.CurrentBlock.block.plot.data[1].length == 0) slice = 2;

		const labels = window.CurrentBlock.block.plot.series.slice(slice);

		this.seriesSection.formThree.selectedSerie.setOptions(labels, callBack);
		if (value) this.seriesSection.formThree.selectedSerie.value = value;

	}
	
	getSerieByName(serieName) {

		let currentSerie;

		for (const serie of window.CurrentBlock.block.plot.series) {

			if (serie.label === serieName) {

				currentSerie = serie;
				break;

			}

		}

		return currentSerie;

	}

	overWriteSetData() {
		this.seriesSection.setData = (newSerie, ignore) => {


			const currentSerieName = this.seriesSection.formThree.selectedSerie.value;
			const currentSerie = (ignore) ? newSerie : this.getSerieByName(currentSerieName);
			console.log(currentSerie);
			if (currentSerie != null) {

				this.seriesSection.containers.forEach((container) => {

					container.setData(currentSerie);

				});

				this.seriesSection.fields.forEach((field) => {

					const paths = field.att.split('.');
					let result;

					for (const path of paths) {
						result = result?.[path] ?? currentSerie?.[path];
					}

					field.value = result ?? field.value;


				});

				this.attSeriesSelector(currentSerie.label);

			} else {

				this.attSeriesSelector();
			}

		};
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