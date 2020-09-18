const Components = require('../../components');

module.exports = class Menu {
	constructor(menuName, menuId) {
		this.menuName = menuName;
		this.menuComponent = document.createElement('div');
		this.menuComponent.id = menuId;
		this.menuComponent.className = 'menuContainer';
		this.onLoadFunctions = [];
	}
	load() {

	}
	onLoad(){

	}
	setEvents() {
		window.addEventListener('openMenu', (evt) => {
			if ((evt.detail.name) + '_menu' == this.menuComponent.id) {
				this.onLoad();
				this.menuComponent.style.display = 'block';

			} else {
				this.menuComponent.style.display = 'none';
			}
		});
	}
	build() {
		let header = Components.menuHeader(this.menuName);
		this.menuComponent.appendChild(header);
		document.getElementById('Menus').appendChild(this.menuComponent);
		this.load();
		this.setEvents();
	}
};