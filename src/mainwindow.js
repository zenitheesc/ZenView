const SideMenu = require('./components/sideMenu/sideMenu.js');
const fs = require('fs');
//const  = require('./sideMenu/sideMenu');

class MainWindow {
	constructor() {
		this.component;
		this.SideMenu = new SideMenu();
		this.MainWindow;
	}
	build() {
		window['ZenViewConfig'] = JSON.parse(fs.readFileSync('./src/config.json'));
		this.SideMenu.build();
	}
}

window.onload = () => {
	let App = new MainWindow();
	App.build();
};