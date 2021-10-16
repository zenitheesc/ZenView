const MenuItem = require('./menuItem');
const EventHandler = require('../../eventHandler/eventHandler');
const Utillities = require('../../../utillities');

module.exports = class MenuList {

	constructor() {

		this.menuListComponent = document.getElementById('MenuList');
		this.eventHandler = new EventHandler();

	}

	changeMidContainerHover(color, slice = false) {

		let svgs = [...document.querySelectorAll('#midContainer button.menuItem svg')];

		if (slice) svgs = svgs.slice(1, -1);

		svgs.forEach((element) => {

			element.style.setProperty('--global-colorHover', color);

		});

	}

	loadOptions(containerName, menuItens) {

		const container = document.createElement('div');
		container.id = containerName;
		menuItens.forEach((menuItem) => {

			container.appendChild(menuItem.htmlComponent());

		});
		this.menuListComponent.appendChild(container);

	}

	loadTopOptions() {

		const menuItens = [];

		menuItens.push(new MenuItem('dashboards', 'grid-1x2', Utillities.getButtonText(1), 'any'));
		menuItens.push(new MenuItem('newDashboard', 'plus-square', Utillities.getButtonText(2), 'any'));

		this.loadOptions('topContainer', menuItens);

	}

	loadMidOptions() {

		const menuItens = [];

		menuItens.push(new MenuItem('start', 'play', Utillities.getButtonText(3), ['editing', 'running']));
		menuItens.push(new MenuItem('inputs', 'process', Utillities.getButtonText(4), 'editing'));
		menuItens.push(new MenuItem('blocks', 'clipboard-data', Utillities.getButtonText(5), 'editing'));
		menuItens.push(new MenuItem('edit', 'pencil-square', Utillities.getButtonText(6), 'editing'));
		menuItens.push(new MenuItem('terminal', 'terminal', Utillities.getButtonText(10), ['editing', 'running']));

		this.loadOptions('midContainer', menuItens);

		this.eventHandler.addEventListener('DashboardWasOpened', (evt) => {

			this.changeMidContainerHover('whitesmoke');

		});

		this.eventHandler.addEventListener('StartRead', (evt) => {

			this.changeMidContainerHover('#54555c', true);

		});

		this.eventHandler.addEventListener('StopRead', (evt) => {

			this.changeMidContainerHover('whitesmoke');

		});

	}

	loadBottomOptions() {

		const menuItens = [];

		menuItens.push(new MenuItem('about', 'info-circle', Utillities.getButtonText(8), 'any'));
		menuItens.push(new MenuItem('configs', 'gear', Utillities.getButtonText(9), 'any'));

		this.loadOptions('bottonContainer', menuItens);

	}

	build() {

		this.loadTopOptions();
		this.loadMidOptions();
		this.loadBottomOptions();

	}

};
