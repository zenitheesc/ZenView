const SideMenu = require('./components/sideMenu/sideMenu.js');
const DashBoardsManager = require('./components/dashBoard/DashBoardsManager.js');
const fs = require('fs');
const ipc = require('electron').ipcRenderer;
const DataReader = require('./components/dataReader/dataReader');
const DashBoard = require('./components/dashBoard/DashBoard');
class MainWindow {

	constructor() {

		this.DataReader = new DataReader();
		this.SideMenu = new SideMenu();
		this.DashBoardsManager = new DashBoardsManager();
		this.DashBoard = new DashBoard();

	}
	saveConfig() {

		fs.writeFileSync('./src/config.json', JSON.stringify(window['ZenViewConfig'], null, '\t'));

	}

	changeGlobalContext(context) {

		window.GlobalContex = context;

	}

	init() {

		window.addEventListener('saveConfigs', () => {

			this.saveConfig();

		});

		window.addEventListener('GlobalContextChange', (evt) => {

			this.changeGlobalContext(evt.detail.context);

		});

	}
	build() {

		let duracao = Date.now();

		window['ZenViewConfig'] = JSON.parse(fs.readFileSync('./src/config.json'));

		this.init();
		this.SideMenu.build();
		this.DashBoardsManager.build();
		this.DataReader.build();
		this.DashBoard.build();

		window.dispatchEvent(new CustomEvent('GlobalContextChange', {
			detail: {
				context: 'any',
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