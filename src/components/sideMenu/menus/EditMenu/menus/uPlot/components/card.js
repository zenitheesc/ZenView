const Container = require('../../../../../../formBuilder/formBuilder').Container;
const Field = require('../../../../../../formBuilder/formBuilder').Field;
const EventHandler = require('../../../../../../eventHandler/eventHandler');
const Components = require('../../../../../../components');

module.exports = class Card {

	constructor(serie) {

		this.eventHandler = new EventHandler();
		this.serie = serie;
		this.opened = true;

		this.htmlComponent = document.createElement('div');
		this.htmlComponent.className = 'mb-3';

		this.seriesSection = Container.div({
			yAxes: Field.select({
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
					conditions: [
						{
							id: 'uPlotScatterShowLines',
							att: 'checked',
							requiredValue: true,
						},
					],
				}),
			}),
		}
		);

		this.seriesSection.setAttribute("form");
		this.load();

	}

	inputHeader() {

		const cardHeader = document.createElement('div');
		cardHeader.setAttribute('class', 'row  m-0 justify-content-between');
		cardHeader.classList.add('inputCard');

		const cardHeaderIcon = document.createElement('i');
		cardHeaderIcon.innerHTML = Components.icon('list-ol-solid');
		cardHeaderIcon.className = 'inputCardIcon';

		this.cardHeaderTitle = document.createElement('div');
		this.cardHeaderTitle.className = 'inputCardTitle';
		this.cardHeaderTitle.innerText = this.serie.label;

		const cardHeaderWrapper = document.createElement('div');
		cardHeaderWrapper.className = 'row m-0 inputCardWrapper';

		const cardInputButtons = this.inputButtons();

		cardHeaderWrapper.appendChild(cardHeaderIcon);
		cardHeaderWrapper.appendChild(this.cardHeaderTitle);

		cardHeader.appendChild(cardHeaderWrapper);
		cardHeader.appendChild(cardInputButtons);

		this.htmlComponent.appendChild(cardHeader);

	}

	inputButtons() {

		const cardButtons = document.createElement('div');

		this.editBtn = Components.buttonWithIcon('pencil-square', 'inputCardOption');
		this.delBtn = Components.buttonWithIcon('trash-alt-regular', 'inputCardOption trashInputCardOption');

		cardButtons.appendChild(this.editBtn);
		cardButtons.appendChild(this.delBtn);

		return cardButtons;

	}

	openMenu() {

		this.seriesSection.htmlComponent.style.display = 'block';
		this.opened = true;
		this.eventHandler.dispatchEvent('MenuOpened', this.serie.uuid);

	}

	closeMenu() {

		this.seriesSection.htmlComponent.style.display = 'none';
		this.opened = false;

	}

	load() {

		this.inputHeader();
		this.setEvents();
		this.openMenu();

		this.seriesSection.setData(this.serie);
		this.htmlComponent.appendChild(this.seriesSection.htmlComponent);

	}

	updateInputList() {

		const callBack = (input) => {

			return [input.name ?? input.value, input.name];

		};

		let allInputs = [];

		allInputs = allInputs.concat(window.CurrentInputGroup.rawInputs);
		allInputs = allInputs.concat(window.CurrentInputGroup.inputs);

		this.seriesSection.formTree.yAxes.setOptions(allInputs, callBack);
		this.seriesSection.formTree.yAxes.value = this.serie.inputName;
	}

	setEvents() {

		this.seriesSection.setData = (objData) => {
			this.seriesSection._setData(objData);
			this.updateInputList();
		}

		this.eventHandler.addEventListener('AttInputList', () => {

			this.updateInputList();

		});

		this.eventHandler.addEventListener('MenuOpened', (uuid) => {

			if (uuid !== this.serie.uuid) {

				this.closeMenu();

			}

		});

		this.editBtn.addEventListener('click', () => {

			this.openMenu();
			this.seriesSection.setData(this.serie);

		});

		this.delBtn.addEventListener('click', () => {

			window.CurrentBlock.sendBlockInstruction({
				command: 'removeSerie',
				data: {
					label: this.serie.label,
					uuid: this.serie.uuid,
				}
			});

			this.eventHandler.dispatchEvent('UpdateSeries');

		});

		this.seriesSection.htmlComponent.addEventListener('input', (evt) => {

			this.serie = window.CurrentBlock.sendBlockInstruction({
				command: 'editSerie',
				data: {
					...this.seriesSection.getData(),
					uuid: this.serie.uuid,
				}
			});

			evt.stopPropagation();

		});

		this.seriesSection.formTree.yAxes.htmlComponent.addEventListener('change', (evt) => {

			this.cardHeaderTitle.innerText = this.seriesSection.formTree.yAxes.value;

		});
	}

};

