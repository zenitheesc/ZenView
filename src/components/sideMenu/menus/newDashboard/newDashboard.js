const Menu = require('../menu');
const Components = require('../../../components.js');
const Validator = require('../../../../validator');
const fs = require('fs');
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

		let dashBoardNbmrOfInputs = Components.numberInput({
			text: 'Número de entradas',
			id: 'newNmbr',
			tests: [Validator.isFilled,(x)=>{ return Validator.isInRange(x,1,30);} ]
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

			window.dispatchEvent(new CustomEvent('newDashBoard', {
				detail:{
					name: data['newName'],
					numberOfInputs: data['newNmbr'],
					path: data['newPath'] +'/' + newName,
					desc: data['newDesc']
				}
			}));

			this.form.clear();
		}
	}
}