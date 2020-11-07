const Menu = require('../menu');
const Components = require('../../../components.js');
const DashBoardCard = require('./dashBoardCard');

module.exports = class DashBoardsMenu extends Menu {

	constructor() {

		super('Dashboards', 'dashboards_menu');
		this.container = document.createElement('div');

	}
	attDashBoardsList() {

		this.container.innerHTML = '';
		const savedDashboards = window['ZenViewConfig'].dashboards;

		savedDashboards.forEach((dashboard) => {

			this.container.appendChild((new DashBoardCard(dashboard.name, dashboard.desc, dashboard.path)).htmlComponent);

		});

	}
	dashboardListSpliter() {

		const spliter = Components.spliter('dashBoardsList', 'Dashboards salvos', this.container, true);
		spliter.style.height = '100%';
		this.menuComponent.appendChild(spliter);

	}
	load() {

		this.dashboardListSpliter();
		this.attDashBoardsList();

		this.EventHandler.addEventListener('AttDashBoardsList', ()=>{

			this.attDashBoardsList();

		});

	}

};