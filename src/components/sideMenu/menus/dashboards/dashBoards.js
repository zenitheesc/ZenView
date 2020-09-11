const Menu = require('../menu');
const Components = require('../../../components.js');
module.exports = class DashBoardsMenu extends Menu {
	constructor() {
		super('Dashboards', 'dashboards_menu');
	}
	dashboardListSpliter() {
		let container = document.createElement('div');
		let savedDashboards = window['ZenViewConfig'].dashboards;
		savedDashboards.forEach(dashboard => {
			container.appendChild(Components.dashBoardCard(dashboard.name, dashboard.desc, __dirname));
		});

		let spliter = Components.spliter('dashBoardsList', 'Dashboards salvos', container, true);
		spliter.style.height = '100%';
		this.menuComponent.appendChild(spliter);
	}
	load() {
		this.dashboardListSpliter();
	}
};