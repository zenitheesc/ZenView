const Components = require('../../components');
const EventHandler = require('../../eventHandler/eventHandler');

module.exports = class Menu {

	constructor(menuName, menuId) {
		
		this.menuName = menuName;
		this.EventHandler = new EventHandler();
		this.menuComponent = document.createElement('div');
		this.menuComponent.id = menuId;
		this.menuComponent.className = 'menuContainer';
		this.onLoadFunctions = [];

	}
	load() {

	}
	onOpen() {

	}
	setEvents() {

		this.EventHandler.addEventListener('OpenMenu', (evt) => {

			if ((evt.name) + '_menu' === this.menuComponent.id) {

				this.onOpen();
				this.menuComponent.style.display = 'block';

			} else {

				this.menuComponent.style.display = 'none';

			}

		});

	}
	build() {

		const header = Components.menuHeader(this.menuName);
		this.menuComponent.appendChild(header);
		document.getElementById('Menus').appendChild(this.menuComponent);
		this.load();
		this.setEvents();

	}

};