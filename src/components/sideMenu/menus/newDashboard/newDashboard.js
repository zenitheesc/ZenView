const Menu = require('../menu');
const Components = require('../../../components.js');
const Validator = require('../../../../validator');
const fs = require('fs');
const DashBoard = require('../../../../classes/dashBoard');
module.exports = class newDashBoardMenu extends Menu {
	constructor() {
		super('New Dashboard', 'newDashboard_menu');
		this.createButton = document.createElement('button');
		this.form = Components.form();
		this.logicComponent = new newDashBoardMenuLogic(this.createButton, this.form);
	}
	LoadAddNewDashBoardButton() {
		this.createButton.style.width = '50%';
		this.createButton.style.marginLeft = '25%';
		this.createButton.style.marginRight = '25%';
		this.createButton.className = 'green-btn';
		this.createButton.textContent = 'Criar';
		this.createButton.type = 'button';
	}
	newDashboardSpliter() {

		let dashBoardNameInput = Components.textInput({
			text: 'Nome',
			id: 'newName',
			tests: [Validator.isFilled, Validator.noSpecialChars]
		});

		let dashBoardPath = Components.pathInput({
			text: 'Diretório',
			id: 'newPath',
			tests: [Validator.isFilled]
		});

		const isInRange = (value) => {
			if (value <= 30 && value >= 1) {
				return true;
			} else {
				return 'Deve ser um número entre 1 e 30';
			}
		};

		let dashBoardNbmrOfInputs = Components.numberInput({
			text: 'Número de entradas',
			id: 'newNmbr',
			tests: [Validator.isFilled, isInRange]
		});
		let dashBoardDescription = Components.textArea({
			text: 'Descrição',
			id: 'newDesc'
		});
		dashBoardDescription.htmlComponent.childNodes[1].style.height = '16em';

		this.LoadAddNewDashBoardButton();

		this.form.addField(dashBoardNameInput);
		this.form.addField(dashBoardPath);
		this.form.addField(dashBoardNbmrOfInputs);
		this.form.addField(dashBoardDescription);
		this.form.addComponent(this.createButton);

		let spliter = Components.spliter('newDashboard', 'Criar novo Dashboard', this.form.htmlComponent, true);

		return spliter;
	}
	importDashBoardSpliter() {
		let container = document.createElement('div');

		let spliter = Components.spliter('importDashboard', 'Importar Dashboard', container, true);

		return spliter;
	}
	load() {
		let spliterContainer = document.createElement('div');
		spliterContainer.className = 'menuBody';

		spliterContainer.appendChild(this.newDashboardSpliter());
		spliterContainer.appendChild(this.importDashBoardSpliter());

		this.menuComponent.appendChild(spliterContainer);
	}
};

class newDashBoardMenuLogic {
	constructor(createDashBoardButton, createDashBoardForm) {
		this.createButton = createDashBoardButton;
		this.form = createDashBoardForm;
		this.createButton.addEventListener('click', () => this.getData());
	}
	getData() {
		if (this.form.validate()) {
			let data = this.form.getData();
			let i = 0;
			let fileNames = fs.readdirSync(data['newPath']);
			let newName = data['newName'] + '.json';

			while (fileNames.includes(newName)) {
				i = i + 1;
				newName = data['newName'] + `(${i})` + '.json';
			}

			window['ZenViewConfig'].dashboards.unshift({
				'name': data['newName'],
				'path': data['newPath'] + '/' + newName,
				'desc': data['newDesc']
			});

			fs.writeFileSync('./src/config.json', JSON.stringify(window['ZenViewConfig'], null, '\t'));

			let dashBoard = new DashBoard(data['newName'],data['newNmbr'], data['newPath'] +'/' + newName, data['newDesc']);

			

			fs.writeFileSync(data['newPath'] + '/' + newName, JSON.stringify(dashBoard, null, '\t'));

			window.dispatchEvent(new CustomEvent('openDashBoard', {
				detail:{
					context: 'editing',
					dashBoardPath: data['newPath'] +'/' + newName
				}
			}));

			this.form.clear();
		}
	}
}