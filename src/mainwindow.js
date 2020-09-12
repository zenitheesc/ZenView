const SideMenu = require('./components/sideMenu/sideMenu.js');
const fs = require('fs');
const ipc = require('electron').ipcRenderer;

class MainWindow {
	constructor() {
		this.component;
		this.SideMenu = new SideMenu();
		this.MainWindow;
	}
	build() {
		let duracao = Date.now();

		window['ZenViewConfig'] = JSON.parse(fs.readFileSync('./src/config.json'));
		this.SideMenu.build();

		duracao = Date.now() - duracao; //pega a duracao do load
		duracao = (duracao > 3000) ? 0 : 3000 - duracao; //testa se foram mais de 3 segundos
		setTimeout(() => { //caso n tenha sido espera o gif terminar para chamar a janela principal
			ipc.send('mainLoadCompleto', {
				show: true
			});
		}, duracao);
	}
}

window.onload = () => {
	let App = new MainWindow();
	App.build();
};