const SideMenu = require('./components/sideMenu/sideMenu.js');
//const  = require('./sideMenu/sideMenu');

class MainWindow {
	constructor() {
		this.component;
		this.SideMenu = new SideMenu();
		this.MainWindow;
	}
	build() {
		this.SideMenu.build();
	}
}

window.onload = () => {
	let App = new MainWindow();
	App.build();
};