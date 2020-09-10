const Components = require('../../../components');
module.exports = class DashBoardsMenu {
	constructor() {
		this.menuName = 'dashboards_menu';
		this.menuComponent = document.createElement('div');
		this.menuComponent.id = 'dashboards_menu';
		this.menuComponent.className = 'menuContainer';
	}
	dashboardListSpliter(){
		let container = document.createElement('div');
		container.innerHTML = '';
		let savedDashboards = window['ZenViewConfig'].dashboards;
		savedDashboards.forEach(dashboard => {
			container.appendChild(Components.dashBoardCard(dashboard.name,dashboard.desc,__dirname));
		});

		let spliter = Components.spliter('dashBoardsList','Dashboards salvos',container,true);
		spliter.style.height = "100%";
		this.menuComponent.appendChild(spliter);
	}
	load() {
		let header = Components.menuHeader('Dashboards');
		this.menuComponent.appendChild(header);
		this.dashboardListSpliter();
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