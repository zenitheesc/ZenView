const Menu = require('../menu');
const Components = require('../../../components.js');
module.exports = class newDashBoardMenu extends Menu {
	constructor() {
		super('New Dashboard', 'newDashboard_menu');
	}
	LoadAddNewDashBoardButton() {
		let button = document.createElement('button');
		button.style.width = '50%';
		button.style.marginLeft = '25%';
		button.style.marginRight = '25%';
		button.className = 'green-btn';
		button.textContent = 'Criar';

		return button;
	}
	newDashboardSpliter() {
		let container = document.createElement('div');

		let dashBoardNameInput = Components.textInput('Nome', 'newDashBoardNameInput');
		let dashBoardNbmrOfInputs = Components.numberInput('Número de entradas', 'newDashBoardNbmrOfInputs', 1, 30);
		let dashBoardDescription = Components.textArea('Descrição', 'newDashBoardDescription');
		dashBoardDescription.childNodes[1].style.height = '16em';

		let button = this.LoadAddNewDashBoardButton();

		container.appendChild(dashBoardNameInput);
		container.appendChild(dashBoardNbmrOfInputs);
		container.appendChild(dashBoardDescription);
		container.appendChild(button);

		let spliter = Components.spliter('newDashboard', 'Criar novo Dashboard', container, true);

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