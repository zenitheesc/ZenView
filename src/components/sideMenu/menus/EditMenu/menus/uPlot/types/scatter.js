const Container = require('../../../../../../formBuilder/formBuilder').Container;
const Field = require('../../../../../../formBuilder/formBuilder').Field;
const Validator = require('../../../../../../formBuilder/validator');
const Components = require('../../../../../../components');
const EventHandler = require('../../../../../../eventHandler/eventHandler');

module.exports = class uPlotScatter {

	constructor() {

		this.eventHandler = new EventHandler();

		this.seriesSection = Container.spliter({
			selectedSerie: Field.select({
				att: 'currSerie',
				label: 'Séries',
				validators: [this.validateSelectedSerie],
				append: [
					{
						type: 'button',
						content: Components.icon('plus-square'),
						classList: ['formButtonWithIconPrepend'],
					},
					{
						type: 'button',
						content: Components.icon('trash-alt-regular'),
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
						content: Components.icon('pencil-square'),
						classList: ['formButtonWithIconPrepend'],
					},
				],
			}),
			yAxis: Field.select({
				att: 'inputName',
				label: 'Dados',
				prepend: [
					{
						type: 'text',
						text: 'Y',
						classList: ['formTextPrepend'],
					},
				],
			}),
			serieStyle: Container.div({
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
					lineShape: Field.select({
						label: 'Interpolação',
						att: 'pathType',
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
				xAxis: Field.select({
					att: 'inputName',
					label: "Eixo X",
					prepend: [
						{
							type: 'text',
							text: 'X',
							classList: ['formTextPrepend'],
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
				scaleOpts: Container.formRow({
					xAxesDirection: Field.select(
						{
							label: 'Tamanho',
							att: 'size',
							classList: ['col-6'],
							options: [
								{
									text: "Crescente",
								},
								{
									text: "Decrescente",
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
									text: 'Top',
								},
								{
									text: 'Bottom',
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
									text: "Crescente",
								},
								{
									text: "Decrescente",
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
									text: 'Direita',
								},
								{
									text: 'Esquerda',
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

	nameAlreadyExists(newName) {

		let alreadyExist = false;

		for (const serie of window.CurrentBlock.block.plot.series) {
			if (serie.label === newName && this.seriesSection.formThree.selectedSerie.value !== newName) {
				alreadyExist = true;
				break;
			}
		}

		return alreadyExist;
	}

	editXAxis() {

		window.CurrentBlock.sendBlockInstruction({
			command: 'editXAxis',
			data: this.form.formThree.uPlotXAxesStyle.xAxis.value,
		});

	}

	validateSelectedSerie(value) {

		if (value == "" || value == null) {

			return 'Selecione ou crie uma nova série';

		} else {

			return true;

		}

	}

	attXandYInputList() {

		const callBack = (input) => {

			return [input.name ?? input.value, input.name];

		};

		let allInputs = [];

		allInputs = allInputs.concat(window.CurrentInputGroup.rawInputs);
		allInputs = allInputs.concat(window.CurrentInputGroup.inputs);

		this.seriesSection.formThree.yAxis.setOptions(allInputs, callBack);
		this.form.formThree.uPlotXAxesStyle.xAxis.setOptions(allInputs, callBack);

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

	addNewSerie() {

		const color = this.selectColor(this.seriesSection.formThree.selectedSerie.input.options.length)

		let newSerieName = "série " + this.seriesSection.formThree.selectedSerie.input.options.length;
		let cont = 0;

		while (this.nameAlreadyExists(newSerieName)) {
			newSerieName = "série " + cont;
			cont++;
		}

		const data = {
			label: newSerieName,
			width: 6,
			paths: 1,
			points: {
				showPoints: true,
				size: 10,
			},
			pathType: "1",
			show: true,
			inputName: this.seriesSection.formThree.yAxis.value,
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

	rmvSerie() {

		window.CurrentBlock.sendBlockInstruction({
			command: 'rmvSerie',
			data: {
				label: this.seriesSection.formThree.selectedSerie.value,
			}
		});

	}

	attSeriesSelector(value) {

		const callBack = (serie) => {

			return [serie.label, serie.label];

		};

		let slice = 1;
		if (window.CurrentBlock.block.plot?.series[1]?.inputName == null) slice = 2;

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

			this.attSeriesSelector();
			this.seriesSection.formThree.currSerie.hideWarning();

			const currentSerieName = this.seriesSection.formThree.selectedSerie.value;
			const currentSerie = (ignore) ? newSerie : this.getSerieByName(currentSerieName);

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

				this.seriesSection.formThree.selectedSerie.value = currentSerie.label;

			}

		};

	}

	setEvents() {

		this.eventHandler.addEventListener('AttInputList', () => {

			this.attXandYInputList();

		});

		this.seriesSection.formThree.selectedSerie.append[0].onclick = () => {

			const newSerie = this.addNewSerie();
			this.seriesSection.reset()
			this.seriesSection.setData(newSerie, true);
			this.seriesSection.setConditions()

		};

		this.seriesSection.formThree.selectedSerie.htmlComponent.addEventListener('input', (evt) => {

			const currName = this.seriesSection.formThree.selectedSerie.value;
			this.seriesSection.setData(this.getSerieByName(currName), true);
			this.seriesSection.setConditions()
			evt.stopPropagation();

		});

		this.form.formThree.uPlotXAxesStyle.self.htmlComponent.addEventListener('input', (evt) => {

			this.editXAxis();
			evt.stopPropagation();

		});

		this.seriesSection.formThree.currSerie.htmlComponent.addEventListener('input', (evt) => {

			evt.stopPropagation();

		});

		this.seriesSection.formThree.currSerie.append[0].onclick = () => {

			if (this.seriesSection.validate()) {

				const response = this.nameAlreadyExists(this.seriesSection.formThree.currSerie.value)

				if (!response) {

					const data = { ...this.seriesSection.getData().blockConfig.uPlot.scatter.series };
					window.CurrentBlock.sendBlockInstruction({
						command: 'renameSerie',
						data
					});

					this.attSeriesSelector(data.label);

				} else {

					this.seriesSection.formThree.currSerie.showWarning('Esse nome já existe')

				}

			}

		};

		this.seriesSection.formThree.selectedSerie.append[1].onclick = () => {

			if (this.seriesSection.validate()) {

				this.rmvSerie()
				this.seriesSection.setData();

			}

		}

		this.overWriteSetData();

	}

};
