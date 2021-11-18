const Container = require('../../../../../formBuilder/formBuilder').Container;
const Field = require('../../../../../formBuilder/formBuilder').Field;
const EventHandler = require('../../../../../eventHandler/eventHandler');

module.exports = class MapEditMenu {

	constructor() {

		this.eventHandler = new EventHandler();

		this.form = Container.div({
			GPSconfig: Container.splitter({
				longitude: Field.select({
					att: 'longitude',
					label: "Longitude",
				}),
				latitude: Field.select({
					att: 'latitude',
					label: "Latitude",
				}),
				style: Field.colorPicker({
					att: 'style',
					value: "#7EB26D",
					label: "Cor"
				}),
				radius: Field.select({
					att: 'radius',
					label: 'Tamanho dos Marcadores',
					options: [
						{
							text: 0,
						},
						{
							text: 2,
						},
						{
							text: 4,
						},
						{
							text: 6,
						},
						{
							text: 8,
						},
					],
				}),
			}, {
				startOpen: true,
				text: 'Configuração do GPS',
			}),
		},
			{
				id: 'GPSEditMenuConfig',
				att: 'GPS',
				conditions: [
					{
						id: 'BlockModule',
						att: 'value',
						requiredValue: 'GPS',
					},
				],
			},
		);

		this.setEvents();

	}

	attInputList() {

		const callBack = (input) => {

			return [input.name ?? input.value, input.name];

		};

		let allInputs = [];

		allInputs = allInputs.concat(window.CurrentInputGroup.rawInputs);
		allInputs = allInputs.concat(window.CurrentInputGroup.inputs);

		this.form.formTree.GPSconfig.longitude.setOptions(allInputs, callBack);
		this.form.formTree.GPSconfig.latitude.setOptions(allInputs, callBack);

	}

	setEvents() {

		this.eventHandler.addEventListener('AttInputList', () => {

			this.attInputList();

		});

	}

};
