const Menu = require('../menu');
const Validator = require('../../../formBuilder/validator');
const Form = require('../../../formBuilder/formBuilder').Form;
const Container = require('../../../formBuilder/formBuilder').Container;
const Field = require('../../../formBuilder/formBuilder').Field;
const EventHandler = require('../../../eventHandler/eventHandler');
const Dialog = require('../../../dialog/dialog');
module.exports = class StartRead extends Menu {

	constructor() {

		super('Iniciar Leitura', 'start_menu');
		this.EventHandler = new EventHandler();
		this.isReading = false;

		this.button = Field.button({
			text: 'Iniciar Leitura',
			classList: ['formCenteredBtn', 'green-btn'],
		});

		this.form = new Form({
			startReadSplitter: Container.spliter({
				dataChannel: Field.select({
					label: 'Fonte dos dados: ',
					att: 'readFrom',
					id: 'currReadFrom',
					options: [{
						text: 'serial',
					},
					{
						text: 'csv',
					},
					],
				}),
				serialContainer: Container.div({
					port: Field.select({
						label: 'Porta',
						att: 'port',
						validators: [Validator.isFilled],
					}),
					baudRate: Field.select({
						label: 'Baud Rate',
						att: 'baudRate',
						options: [{
							text: 4800,
						},
						{
							text: 9600,
						},
						{
							text: 14400,
						},
						{
							text: 38400,
						},
						{
							text: 57600,
						},
						{
							text: 115200,
						},
						],
					}),

				}, {
					id: 'serialReadOptions',
					att: 'serialReadConfig',
					conditions: [{
						id: 'currReadFrom',
						att: 'value',
						requiredValue: 'serial',
					}],
				}),
				csvContainer: Container.div({
					file: Field.directory({
						label: 'Arquivo:',
						att: 'filePath',
						type: 'file',
						validators: [Validator.isFilled, Validator.extension('.csv')],
					}),
					simulate: Field.checkBox({
						label: 'Simular',
						att: 'simulate',
						id: 'simulateCurrentRead',
					}),
					simulationContainer: Container.div({
						dataChannel: Field.select({
							label: 'Tipo de intervalo',
							att: 'intervalType',
							id: 'intervalType',
							options: [{
								text: 'Fixo',
								value: 'fixed',
							},
							{
								text: 'Entrada',
								value: 'input',
							},
							],
						}),
						fixInterval: Field.number({
							label: 'Intervalo em ms',
							att: 'fixIntervalSize',
							id: 'fixIntervalSize',
							validators: [Validator.isFilled, Validator.isNumber, Validator.isPositive],
							conditions: [{
								id: 'intervalType',
								att: 'value',
								requiredValue: 'fixed',
							}],
						}),
						inputInterval: Field.select({
							label: 'Entrada do intervalo de tempo ',
							att: 'timeIntervalInput',
							id: 'timeIntervalInput',
							conditions: [{
								id: 'intervalType',
								att: 'value',
								requiredValue: 'input',
							}],
						}),
					}, {
						id: 'simulationOptions',
						att: 'simulation',
						conditions: [{
							id: 'simulateCurrentRead',
							att: 'checked',
							requiredValue: true,
						}],
					}),
				}, {
					id: 'csvReadOptions',
					att: 'csvReadConfig',
					conditions: [{
						id: 'currReadFrom',
						att: 'value',
						requiredValue: 'csv',
					}],
				}),
				save: Field.checkBox({
					label: 'Salvar leitura',
					att: 'save',
					id: 'saveCurrentRead',
				}),
				saveOutputContainer: Container.div({
					fileName: Field.text({
						label: 'Nome do arquivo',
						att: 'fileName',
						validators: [Validator.isFilled],
					}),
					filePath: Field.directory({
						label: 'Diretório',
						att: 'filePath',
						validators: [Validator.isFilled],
					}),

				}, {
					id: 'saveReadOptions',
					att: 'saveReadConfig',
					conditions: [{
						id: 'saveCurrentRead',
						att: 'checked',
						requiredValue: true,
					}],
				}),
				start: this.button,
			}, {
				startOpen: true,
				text: 'Configurações',
				id: 'startReadSplitter',
			}),
		});

	}

	startRead() {

		if (!this.form.validate()) return;

		this.EventHandler.StartRead(this.form.getData());

		this.setStopReadState();

		this.EventHandler.GlobalContextChange({
			context: 'running',
		});

	}

	stopRead() {

		this.EventHandler.StopRead(this.form.getData());

		this.setInitReadState();

	}

	setInitReadState() {

		this.button.htmlComponent.textContent = 'Iniciar Leitura';

		this.button.htmlComponent.classList.add('green-btn');
		this.button.htmlComponent.classList.remove('red-btn');

		this.isReading = false;

		this.EventHandler.GlobalContextChange({
			context: 'editing',
		});

	}

	setStopReadState() {

		this.button.htmlComponent.textContent = 'Finalizar Leitura';

		this.button.htmlComponent.classList.remove('green-btn');
		this.button.htmlComponent.classList.add('red-btn');

		this.isReading = true;

	}

	attInputList() {

		this.form.formThree.startReadSplitter.

			csvContainer.simulationContainer.inputInterval.setOptions(window.CurrentInputGroup.rawInputs, (value) => {

				let sub = value.name.split('_')[1];
				sub = Number(sub);
				return [sub, value.name];

			});

	}

	load() {

		const spliterContainer = document.createElement('div');
		spliterContainer.className = 'menuBody';
		spliterContainer.appendChild(this.form.htmlComponent);
		this.menuComponent.appendChild(this.form.htmlComponent);

		this.button.onclick = () => {

			if (!this.isReading) {

				if (!window.CurrentInputGraph.hasInconsistency) {

					this.startRead();

				} else {

					Dialog.showDialog({
						title: 'Error',
						message: 'Suas entradas possuem inconsistências',
						buttons: ['Ok'],
					});

				}
				

			} else {

				this.stopRead();

			}


		};

		this.EventHandler.addEventListener('AttInputList', () => {

			this.attInputList();

		});

		this.EventHandler.addEventListener('DataReadingFinished', () => {

			this.setInitReadState();

		});

	}

};