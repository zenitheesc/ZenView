const Container = require('../../../../../../formBuilder/formBuilder').Container;
const Field = require('../../../../../../formBuilder/formBuilder').Field;
const EventHandler = require('../../../../../../eventHandler/eventHandler');
const Card = require('../components/card');
const { v4: uuidv4 } = require('uuid');
module.exports = class uPlotScatter {

	constructor() {

		this.eventHandler = new EventHandler();

		this.seriesSection = Container.spliter({
			cards: Container.div({}),
			button: Field.button({
				text: 'Adicionar nova série',
				att: 'newSerieBtn',
				classList: ['formCenteredBtn', 'green-btn'],
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
							value: 1,
						},
						{
							text: 'Logaritimica',
							value: 2,
						},
					],
				}),
				scaleOpts: Container.formRow({
					xAxesDirection: Field.select(
						{
							label: 'Direção',
							att: 'dir',
							classList: ['col-6'],
							options: [
								{
									text: "Crescente",
									value: 1
								},
								{
									text: "Decrescente",
									value: -1
								},
							],
						},
					),
					xAxesPos: Field.select(
						{
							label: 'Posição',
							att: 'side',
							classList: ['col-6'],
							options: [
								{
									text: 'bottom',
									value: 2
								},
								{
									text: 'top',
									value: 0
								}

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
							value: 1,
						},
						{
							text: 'Logaritimica',
							value: 2,
						},
					],
				}),
				scaleOpts: Container.formRow({
					yAxesDirection: Field.select(
						{
							label: 'Tamanho',
							att: 'dir',
							classList: ['col-6'],
							options: [
								{
									text: "Crescente",
									value: 1
								},
								{
									text: "Decrescente",
									value: -1
								},
							],
						},
					),
					yAxesPos: Field.select(
						{
							label: 'Posição',
							att: 'side',
							classList: ['col-6'],
							options: [
								{
									text: 'esquerda',
									value: 3
								}, {
									text: 'direita',
									value: 1
								}
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

		this.inputListComponent = document.createElement('div');
		this.seriesSection.formThree.cards.self.htmlComponent.appendChild(this.inputListComponent);

		this.inputList = [];
		this.openedMenu;

		this.overWriteSetData();
		this.setEvents();

	}

	editXAxis() {

		window.CurrentBlock.sendBlockInstruction({
			command: 'editXAxis',
			data: this.form.formThree.uPlotXAxesStyle.self.getData().blockConfig.uPlot.scatter.axis.x
		});

	}

	editYAxis() {

		window.CurrentBlock.sendBlockInstruction({
			command: 'editYAxis',
			data: this.form.formThree.uPlotYAxesStyle.self.getData().blockConfig.uPlot.scatter.axis.y
		});

	}

	attXandYInputList() {

		const callBack = (input) => {

			return [input.name ?? input.value, input.name];

		};

		let allInputs = [];

		allInputs = allInputs.concat(window.CurrentInputGroup.rawInputs);
		allInputs = allInputs.concat(window.CurrentInputGroup.inputs);

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

		const length = this.inputList.length;
		const color = this.selectColor(length);
		const input = window.CurrentInputGroup.rawInputs[0];

		let newSerieName = "série " + length;


		const data = {
			label: newSerieName,
			width: 4,
			paths: 1,
			points: {
				showPoints: true,
				size: 10,
			},
			pathType: "1",
			show: true,
			inputName: [input.name ?? input.value, input.name],
			showLines: true,
			stroke: color,
			_stroke: color,
		}

		window.CurrentBlock.sendBlockInstruction({
			command: 'addSerie',
			data,
		});


		return data;

	}

	attSeriesList() {

		let slice = 1;
		if (window.CurrentBlock.block.opt?.series[1]?.inputName == null) slice = 2;

		const labels = window.CurrentBlock.block.opt.series.slice(slice);

		this.inputListComponent.innerHTML = '';
		this.inputList = [];

		labels.forEach((label) => {

			let card = new Card(label);

			this.inputList.push(card);
			this.inputListComponent.appendChild(card.htmlComponent)

		});

	}


	overWriteSetData() {

		this.seriesSection.formThree.cards.self.setData = (newSerie) => {

			this.attSeriesList();
			const array = window.CurrentBlock.block.opt.series;

			this.inputList.forEach((card, index) => {

				card.seriesSection.setData(array[index + 1]);

			});

		};

		this.seriesSection.formThree.cards.self.getData = (preResponse) => {

			const response = preResponse || {};

			this.inputList.map((card) => {

				if (card.serie.label === this.openedMenu) {

					return card.seriesSection.getData(response);

				}

			});

			return response.form || response;

		};

	}

	setEvents() {

		this.eventHandler.addEventListener('AttInputList', () => {

			this.attXandYInputList();

		});

		this.eventHandler.addEventListener('UpdateSeries', () => {

			this.attSeriesList();

		});

		this.eventHandler.addEventListener('MenuOpened', (name) => {

			this.openedMenu = name;

		});

		this.seriesSection.formThree.button.onclick = () => {

			this.addNewSerie();
			this.seriesSection.reset()
			this.attSeriesList();
			this.seriesSection.setData();
			this.seriesSection.setConditions()

		};

		this.form.formThree.uPlotXAxesStyle.self.htmlComponent.addEventListener('input', (evt) => {

			this.editXAxis();
			evt.stopPropagation();

		});

		this.form.formThree.uPlotYAxesStyle.self.htmlComponent.addEventListener('input', (evt) => {

			this.editYAxis();
			evt.stopPropagation();

		});

	}

};
