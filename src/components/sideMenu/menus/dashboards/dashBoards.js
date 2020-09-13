const Menu = require('../menu');
const Components = require('../../../components.js');
module.exports = class DashBoardsMenu extends Menu {
	constructor() {
		super('Dashboards', 'dashboards_menu');
		this.container = document.createElement('div');
	}
	attDashBoardsList(){
		this.container.innerHTML = '';
		let savedDashboards = window['ZenViewConfig'].dashboards;
		savedDashboards.forEach(dashboard => {
			this.container.appendChild(Components.dashBoardCard(dashboard.name, dashboard.desc, dashboard.path));
		});
	}
	dashboardListSpliter() {
		let spliter = Components.spliter('dashBoardsList', 'Dashboards salvos', this.container, true);
		spliter.style.height = '100%';
		this.menuComponent.appendChild(spliter);
	}
	load() {
		this.dashboardListSpliter();
		this.attDashBoardsList();
		window.addEventListener('attDashBoardsList',()=>{
			this.attDashBoardsList();
		});
	}
};