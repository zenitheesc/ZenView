const Menu = require('../menu');
const Components = require('../../../components.js');
const Validator = require('../../../../validator');
const fs = require('fs');
const Form = require('../../../../formBuilder').Form;
const Container = require('../../../../formBuilder').Container;
const Field = require('../../../../formBuilder').Field;

module.exports = class newDashBoardMenu extends Menu {

	constructor() {

		super('New Dashboard', 'newDashboard_menu');
		this.button = Field.button({
			text: 'Criar',
			classList: ['formCenteredBtn', 'green-btn'],
		});

		this.form = new Form({
			newDashBoardSpliter: Container.spliter({
				Name: Field.text({
					label: 'Nome',
					att: 'name',
					validators: [Validator.isFilled],
				}),
				Directory: Field.directory({
					label: 'Diretório',
					att: 'dir',
					validators: [Validator.isFilled],
				}),
				NumberOfInputs: Field.number({
					label: 'Número de entradas',
					att: 'nOfInputs',
					validators: [Validator.isFilled, Validator.isInRange(1, 30)],
				}),
				Description: Field.textArea({
					label: 'Descrição',
					att: 'desc',
				}),
				Save: this.button,
			}, {
				startOpen: true,
				text: 'Novo DashBoard',
				id: 'newDashBoardSpliter',
			}),
		});

	}
	importDashBoardSpliter() {

		const container = document.createElement('div');

		const spliter = Components.spliter('importDashboard', 'Importar Dashboard', container, true);

		return spliter;

	}
	setFormConfigs() {

		this.button.onclick = () => {

			if (this.form.validate()) {

				const data = this.form.getData().form;
				let i = 0;
				const fileNames = fs.readdirSync(data['dir']);
				let newName = data['name'] + '.json';

				while (fileNames.includes(newName)) {

					i = i + 1;
					newName = data['name'] + `(${i})` + '.json';

				}

				window.dispatchEvent(new CustomEvent('newDashBoard', {
					detail: {
						name: data['name'],
						numberOfInputs: data['nOfInputs'],
						path: data['dir'] + '/' + newName,
						desc: data['desc'],
					},
				}));

				this.form.reset();

			}

		};

	}
	load() {

		const spliterContainer = document.createElement('div');
		spliterContainer.className = 'menuBody';

		spliterContainer.appendChild(this.form.htmlComponent);
		spliterContainer.appendChild(this.importDashBoardSpliter());

		this.menuComponent.appendChild(this.form.htmlComponent);
		this.setFormConfigs();

	}

};