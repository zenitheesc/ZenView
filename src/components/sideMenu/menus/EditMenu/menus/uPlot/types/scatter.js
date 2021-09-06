const Container = require('../../../../../../formBuilder/formBuilder').Container;
const Field = require('../../../../../../formBuilder/formBuilder').Field;
const EventHandler = require('../../../../../../eventHandler/eventHandler');
const Card = require('../components/card');

module.exports = class uPlotScatter {

	constructor() {

		this.eventHandler = new EventHandler();

		this.seriesSection = Container.spliter({
			cards: Container.div({}),
			button: Field.button({
				text: 'Adicionar nova série',
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

		this.inputListComponent = document.createElement('div');
		this.seriesSection.formThree.cards.self.htmlComponent.appendChild(this.inputListComponent);

		this.inputList = [];

		this.overWriteSetData();
		this.setEvents();

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

	nameAlreadyExists(newName) {

		let alreadyExist = false;

		for (const serie of window.CurrentBlock.block.plot.series) {
			if (serie.label === newName) {
				alreadyExist = true;
				break;
			}
		}

		return alreadyExist;
	}

	addNewSerie() {

		const length = this.inputList.length;
		const color = this.selectColor(length);
		const input = window.CurrentInputGroup.rawInputs[0];

		let newSerieName = "série " + length;

		window.CurrentBlock.block.plot.series.slice(1).some((serie, index) => {

			if (serie.label !== "série " + index && !this.nameAlreadyExists("série " + index)) {

				newSerieName = "série " + index;
				return true;

			}

			return false;

		});

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

	attSeriesSelector() {

		let slice = 1;
		if (window.CurrentBlock.block.plot?.series[1]?.inputName == null) slice = 2;

		const labels = window.CurrentBlock.block.plot.series.slice(slice);

		this.inputListComponent.innerHTML = '';
		this.inputList = [];

		labels.forEach((label) => {

			let card = new Card(label);

			this.inputList.push(card);
			this.inputListComponent.appendChild(card.htmlComponent)

		});

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

			for (const card of this.inputList) {

				card.seriesSection.setData(newSerie, ignore);

			}

		};

		this.seriesSection.getData = (preResponse) => {

			const response = preResponse || {};

			this.inputList.map((card) => {

				 return card.seriesSection.getData(response);

			});

			return response.form || response;

		};

	}

	setEvents() {

		this.eventHandler.addEventListener('AttInputList', () => {

			this.attXandYInputList();

		});

		this.eventHandler.addEventListener('UpdateSeries', () => {

			this.attSeriesSelector();

		});

		this.seriesSection.formThree.button.onclick = () => {

			const newSerie = this.addNewSerie();
			this.seriesSection.reset()
			this.seriesSection.setData(newSerie, true);
			this.seriesSection.setConditions()
			this.attSeriesSelector();

		};

		this.form.formThree.uPlotXAxesStyle.self.htmlComponent.addEventListener('input', (evt) => {

			this.editXAxis();
			evt.stopPropagation();

		});


	}

};
