const Menu = require('../menu');
const Components = require('../../../components.js');
module.exports = class InputsMenu extends Menu {
	constructor() {
		super('Entradas', 'inputs_menu');
	}
	dashboardListSpliter() {
		let container = document.createElement('div');
		let savedDashboards = window['ZenViewConfig'].dashboards;
		savedDashboards.forEach(dashboard => {
			container.appendChild(Components.inputCard(dashboard.name, dashboard.desc, __dirname));
			container.appendChild(Components.inputCard(dashboard.name, dashboard.desc, __dirname));
		});
		
		let spliter = Components.spliter('dashBoardsList', 'Lista de inputs', container, true);
		spliter.style.height = '100%';
		this.menuComponent.appendChild(spliter);
	}
	load() {
		this.dashboardListSpliter();
	}
};