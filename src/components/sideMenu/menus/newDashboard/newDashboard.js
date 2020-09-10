const Components = require('../../../components');
module.exports = class NewDashBoardMenu {
	constructor() {
		this.menuName = 'newDashboard_menu';
		this.menuComponent = document.createElement('div');
		this.menuComponent.id = 'newDashboard_menu';
		this.menuComponent.className = 'menuContainer';
	}
	LoadAddNewDashBoardButton(){
		let button = document.createElement('button');
		button.style.width = '50%';
		button.style.marginLeft = '25%';
		button.style.marginRight = '25%';
		button.className = 'green-btn';
		button.textContent = 'Criar';

		return button;
	}
	newDashboardSpliter(){
		let container = document.createElement('div');

		let dashBoardNameInput = Components.textInput('Nome','newDashBoardNameInput');
		let dashBoardNbmrOfInputs = Components.numberInput('Número de entradas','newDashBoardNbmrOfInputs',1,30);
		let dashBoardDescription = Components.textArea('Descrição','newDashBoardDescription');
		dashBoardDescription.childNodes[1].style.height = '16em';

		let button = this.LoadAddNewDashBoardButton();

		container.appendChild(dashBoardNameInput);
		container.appendChild(dashBoardNbmrOfInputs);
		container.appendChild(dashBoardDescription);
		container.appendChild(button);

		let spliter = Components.spliter(1,'Criar novo Dashboard',container,true);

		this.menuComponent.appendChild(spliter);
	}
	importDashBoardSpliter(){
		let container = document.createElement('div');

		
		let spliter = Components.spliter(2,'Importar Dashboard',container,true);
		
		
		this.menuComponent.appendChild(spliter);
	}
	load() {
		let header = Components.menuHeader('New Dashboard');
		this.menuComponent.appendChild(header);
		this.newDashboardSpliter();
		this.importDashBoardSpliter();
	}
	setEvents() {
		window.addEventListener('openMenu', (evt) => {
			console.log('abrindo menu ' + evt.detail.name);
			if ((evt.detail.name) + '_menu' == this.menuName) {
				this.menuComponent.style.display = 'block';

			} else {
				this.menuComponent.style.display = 'none';
			}
		});
	}
	build() {
		console.log('Construindo menu dashboard');
		this.load();
		document.getElementById('Menus').appendChild(this.menuComponent);
		this.setEvents();
	}
};