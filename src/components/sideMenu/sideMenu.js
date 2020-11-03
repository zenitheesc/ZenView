const EventHandler = require('../eventHandler/eventHandler');
const MenuList = require('./menuBar/menuList');
const Resizer = require('./resizer');
const Menus = require('./menus');

module.exports = class SideMenu {

	constructor() {

		this.isOpen = false;
		this.currentMenu;
		this.MenuList = new MenuList();
		this.resizer = new Resizer();
		this.Menus = [];
		this.EventHandler = new EventHandler();

		this.sideMenuComponent = document.getElementById('SideMenu');
		this.menuListComponent = document.getElementById('MenuList');
		this.menusComponent = document.getElementById('Menus');

		this.closedWidth = String(Math.floor(screen.width / 32) + 'px');
		this.openedWidth = String(Math.floor(screen.width / 4) + 'px');

	}
	setStyle() {

		this.sideMenuComponent.style.width = this.closedWidth;
		this.sideMenuComponent.style.height = '100%';

		this.menuListComponent.style.width = this.closedWidth;
		this.menuListComponent.style.height = '100%';

		this.menusComponent.style.width = (Math.floor(screen.width / 4) - Math.floor(screen.width / 32)) + 'px';
		this.menusComponent.style.height = '100%';
		this.menusComponent.style.display = 'none';

	}
	/**
	 * Abre ou fecha o menu lateral, dependendo do estádo atual e muda a margem da tela principal
	 * @param {String}requestedMenu nome do menu que deve ser aberto
	 */
	changeSideMenu(requestedMenu) {

		if (!this.isOpen) {

			this.currentMenu = requestedMenu;
			this.openSideMenu();
			
		} else if (requestedMenu != this.currentMenu) {
			
			this.currentMenu = requestedMenu;

		} else {

			this.closeSideMenu();

		}

	}
	openSideMenu() {

		this.sideMenuComponent.style.width = this.openedWidth;
		this.menusComponent.style.display = 'block';
		this.menusComponent.style.width = (Math.floor(screen.width / 4) - Math.floor(screen.width / 32)) + 'px';
		this.isOpen = true;

	}
	closeSideMenu() {

		this.sideMenuComponent.style.width = this.closedWidth;
		this.menusComponent.style.display = 'none';
		this.isOpen = false;

	}
	loadMenus() {

		Menus.forEach((Menu) => {

			const newMenu = new Menu();
			newMenu.build();
			this.Menus.push(newMenu);

		});

	}
	build() {

		this.EventHandler.addEventListener('ChangeSideMenu', (evt) => {

			this.changeSideMenu(evt);

		});

		this.EventHandler.addEventListener('OpenSideMenu', (evt) => {

			this.currentMenu = evt.requested;
			this.openSideMenu();

		});
		
		this.MenuList.build();
		this.loadMenus();
		this.setStyle();
		this.resizer.build();
		
	}

};