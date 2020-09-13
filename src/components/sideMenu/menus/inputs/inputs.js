const Menu = require('../menu');
const Components = require('../../../components.js');
module.exports = class InputsMenu extends Menu {
	constructor() {
		super('Entradas', 'inputs_menu');
		this.container = document.createElement('div');
	}
	attInputList() {
		this.container.innerHTML = '';
		let inputs = window['ZenViewConfig'].lastDasboard.inputs;
		console.log(inputs);
		inputs.forEach(input => {
			this.container.appendChild(Components.inputCard(input.name, input.expression));
		});
	}
	dashboardListSpliter() {
		let spliter = Components.spliter('dashBoardsList', 'Lista de inputs', this.container, true);
		spliter.style.height = '100%';
		this.menuComponent.appendChild(spliter);
	}
	load() {
		this.dashboardListSpliter();
		window.addEventListener('attInputList',()=>{
			this.attInputList();
		});
	}
};