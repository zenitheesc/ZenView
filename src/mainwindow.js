const SideMenu = require('./components/sideMenu/sideMenu.js');
const DashBoardComponent = require('./components/dashBoard/DashBoardsManager.js');
const fs = require('fs');
const ipc = require('electron').ipcRenderer;
const DataReader = require('./components/dataReader/dataReader');
class MainWindow {

	constructor() {

		this.DataReader = new DataReader();
		this.SideMenu = new SideMenu();
		this.DashBoardComponent = new DashBoardComponent();
		this.MainWindow;

	}
	saveConfig() {

		fs.writeFileSync('./src/config.json', JSON.stringify(window['ZenViewConfig'], null, '\t'));

	}
	init() {

		window.addEventListener('saveConfigs', () => {

			this.saveConfig();

		});

	}
	build() {

		let duracao = Date.now();

		window['ZenViewConfig'] = JSON.parse(fs.readFileSync('./src/config.json'));

		this.init();
		this.SideMenu.build();
		this.DashBoardComponent.build();
		this.DataReader.build();

		window.dispatchEvent(new CustomEvent('GlobalContextChange', {
			detail: {
				context: 'all',
			},
		}));

		duracao = Date.now() - duracao; // pega a duracao do load
		console.log('TEMPO DE LOAD: ' + duracao + 'ms');
		duracao = (duracao > 3000) ? 0 : 3000 - duracao; // testa se foram mais de 3 segundos

		setTimeout(() => { // caso n tenha sido espera o gif terminar para chamar a janela principal

			ipc.send('mainLoadCompleto', {
				show: true,
			});

		}, duracao);

	}

}

window.onload = () => {

	const App = new MainWindow();
	App.build();

};