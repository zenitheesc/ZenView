const Components = require('../../../components');
const fs = require('fs');
module.exports = class NewDashBoardMenu {
	constructor() {
		this.menuName = 'newDashboard_menu';
		this.menuComponent = document.createElement('div');
		this.menuComponent.id = 'newDashboard_menu';
		this.menuComponent.className = 'menuContainer';
	}
	load() {
		let container = document.createElement('div');
		let dashBoardNameInput = Components.textInput('Nome','newDashBoardNameInput');
		let dashBoardNbmrOfInputs = Components.numberInput('Número de entradas','newDashBoardNbmrOfInputs',1,30);
		let dashBoardDescription = Components.textArea('Descrição','newDashBoardDescription');

		container.appendChild(dashBoardNameInput);
		container.appendChild(dashBoardNbmrOfInputs);
		container.appendChild(dashBoardDescription);

		let spliter1 = Components.spliter(1,'Criar novo Dashboard',container,true);
		let spliter2 = Components.spliter(2,'Importar Dashboard',container,true);
		let header = Components.menuHeader('New Dashboard');
		//this.menuComponent.innerHTML = html;
		//this.menuComponent.className = 'menuContainer';
		this.menuComponent.appendChild(header);
		this.menuComponent.appendChild(spliter1);
		this.menuComponent.appendChild(spliter2);
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