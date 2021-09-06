const Container = require('../../../../../../formBuilder/formBuilder').Container;
const Field = require('../../../../../../formBuilder/formBuilder').Field;
const EventHandler = require('../../../../../../eventHandler/eventHandler');
const Components = require('../../../../../../components');

module.exports = class Card {

	constructor(serie) {

		this.eventHandler = new EventHandler();
		this.serie = serie;
		this.title = serie.label;

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
		}
        );


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
		cardHeaderTitle.innerText = this.title;

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
			if (serie.label === newName && this.title !== newName) {
				alreadyExist = true;
				break;
			}
		}

		return alreadyExist;
	}

	overWriteSetData() {

		this.seriesSection.setData = (newSerie, ignore) => {
			this.seriesSection.formThree.currSerie.hideWarning();
			const currentSerie = this.serie;

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

			}

		};

	}

	load() {

		this.overWriteSetData();
		this.inputHeader();
		this.setEvents();

		this.seriesSection.setData();
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

		this.saveBtn.addEventListener('click', () => {
			this.seriesSection.htmlComponent.style.display = 'none';
			// TODO: salvar

		});

		this.editBtn.addEventListener('click', () => {

			this.seriesSection.htmlComponent.style.display = 'block';
			this.seriesSection.setData();

		});

		this.delBtn.addEventListener('click', () => {

			window.CurrentBlock.sendBlockInstruction({
				command: 'removeSerie',
				data: {
					label: this.title,
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

