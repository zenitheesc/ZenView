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
		});

		this.load();

	}

	inputHeader() {

		const cardHeader = document.createElement('div');
		cardHeader.setAttribute('class', 'row  m-0 justify-content-between');
		cardHeader.classList.add('inputCard');

		const cardHeaderIcon = document.createElement('i');
		cardHeaderIcon.innerHTML = Components.icon('list-ol-solid');
		cardHeaderIcon.className = 'inputCardIcon';

		const cardHeaderTitle = document.createElement('div');
		cardHeaderTitle.className = 'inputCardTitle';
		cardHeaderTitle.innerText = this.serie.label;

		const cardHeaderWrapper = document.createElement('div');
		cardHeaderWrapper.className = 'row m-0 inputCardWrapper';

		const cardInputButtons = this.inputButtons();

		cardHeaderWrapper.appendChild(cardHeaderIcon);
		cardHeaderWrapper.appendChild(cardHeaderTitle);

		cardHeader.appendChild(cardHeaderWrapper);
		cardHeader.appendChild(cardInputButtons);

		this.htmlComponent.appendChild(cardHeader);

	}

	inputButtons() {

		const cardButtons = document.createElement('div');

		this.saveBtn = Components.buttonWithIcon('save', 'inputCardOption');
		this.editBtn = Components.buttonWithIcon('pencil-square', 'inputCardOption');
		this.delBtn = Components.buttonWithIcon('trash-alt-regular', 'inputCardOption trashInputCardOption');

		cardButtons.appendChild(this.saveBtn);
		cardButtons.appendChild(this.editBtn);
		cardButtons.appendChild(this.delBtn);

		return cardButtons;

	}

	nameAlreadyExists(newName) {

		let alreadyExist = false;

		for (const serie of window.CurrentBlock.block.plot.series) {
			if (serie.label === newName && this.serie.label !== newName) {
				alreadyExist = true;
				break;
			}
		}

		return alreadyExist;
	}

	openMenu() {

		this.seriesSection.htmlComponent.style.display = 'block';
		this.opened = true;
		this.eventHandler.dispatchEvent('MenuOpened', this.serie.label);

	}

	closeMenu() {

		this.seriesSection.htmlComponent.style.display = 'none';
		this.opened = false;

		// TODO: salvar

	}

	load() {

		this.inputHeader();
		this.setEvents();
		this.openMenu();

		this.seriesSection.setData(this.serie);
		this.htmlComponent.appendChild(this.seriesSection.htmlComponent);

	}

	setEvents() {

		this.eventHandler.addEventListener('AttInputList', () => {

			const callBack = (input) => {

				return [input.name ?? input.value, input.name];

			};

			let allInputs = [];

			allInputs = allInputs.concat(window.CurrentInputGroup.rawInputs);
			allInputs = allInputs.concat(window.CurrentInputGroup.inputs);

			this.seriesSection.formThree.yAxis.setOptions(allInputs, callBack);

		});

		this.eventHandler.addEventListener('MenuOpened', (name) => {

			if (name !== this.serie.label) {

				this.closeMenu();

			}

		});

		this.saveBtn.addEventListener('click', () => {

			this.closeMenu();

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
				}
			});

			this.eventHandler.dispatchEvent('UpdateSeries');

		});

		this.seriesSection.formThree.currSerie.append[0].onclick = () => {

			if (this.seriesSection.validate()) {

				const response = this.nameAlreadyExists(this.seriesSection.formThree.currSerie.value);

				if (!response) {

					this.serie.label = this.seriesSection.formThree.currSerie.value;
					const data = {...this.seriesSection.getData().blockConfig.uPlot.scatter.series}

					window.CurrentBlock.sendBlockInstruction({
						command: 'renameSerie',
						data
					});

					this.eventHandler.dispatchEvent('UpdateSeries');

				} else {

					this.seriesSection.formThree.currSerie.showWarning('Esse nome já existe')

				}

			}

		};

		this.seriesSection.formThree.currSerie.htmlComponent.addEventListener('input', (evt) => {

			evt.stopPropagation();

		});

	}

};

