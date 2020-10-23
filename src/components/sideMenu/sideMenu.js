const MenuList = require('./menuBar/menuList');
const Menus = require('./menus');

module.exports = class SideMenu {

	constructor() {

		this.isOpen = false;
		this.currentMenu;
		this.MenuList = new MenuList();
		this.Menus = [];

		this.sideMenuComponent = document.getElementById('SideMenu');
		this.menuListComponent = document.getElementById('MenuList');
		this.menusComponent = document.getElementById('Menus');

		this.closedWidth = String(Math.floor(screen.width / 32) + 'px');
		this.openedWidth = String(Math.floor(screen.width / 4) + 'px');

	}
	setStyle() {

		this.sideMenuComponent.style.width = this.closedWidth;
		this.sideMenuComponent.style.height = '100%';
		// this.sideMenuComponent.style.backgroundColor = Utillites.getColor(2);

		this.menuListComponent.style.width = this.closedWidth;
		this.menuListComponent.style.height = '100%';
		// this.menuListComponent.style.backgroundColor = Utillites.getColor(1);

		this.menusComponent.style.width = this.closedWidth;
		this.menusComponent.style.height = '100%';
		this.menusComponent.style.display = 'none';
		// this.menusComponent.style.backgroundColor = Utillites.getColor(2);

	}
	/**
	 * Abre ou fecha o menu lateral, dependendo do estádo atual e muda a margem da tela principal
	 * @param {String}requestedMenu nome do menu que deve ser aberto
	 */
	changeSideMenu(requestedMenu) {

		if (!this.isOpen || requestedMenu != this.currentMenu) {

			this.currentMenu = requestedMenu;
			this.openSideMenu();

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

		window.addEventListener('changeSideMenu', (evt) => {

			this.changeSideMenu(evt.detail);

		});
		this.MenuList.build();
		this.loadMenus();
		this.setStyle();

	}

};