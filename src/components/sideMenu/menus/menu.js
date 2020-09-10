const Components = require('../../components');

module.exports = class Menu {
	constructor(menuName, menuId) {
		this.menuName = menuName;
		this.menuComponent = document.createElement('div');
		this.menuComponent.id = menuId;
		this.menuComponent.className = 'menuContainer';
	}
	load() {

	}
	setEvents() {
		window.addEventListener('openMenu', (evt) => {
			console.log('abrindo menu ' + evt.detail.name);
			if ((evt.detail.name) + '_menu' == this.menuComponent.id) {
				this.menuComponent.style.display = 'block';

			} else {
				this.menuComponent.style.display = 'none';
			}
		});
	}
	build() {
		let header = Components.menuHeader(this.menuName);
		this.menuComponent.appendChild(header);
		this.load();
		document.getElementById('Menus').appendChild(this.menuComponent);
		this.setEvents();
	}
};