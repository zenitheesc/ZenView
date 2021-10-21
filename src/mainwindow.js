const SideMenu = require('./components/sideMenu/sideMenu.js');
const DashBoardsManager = require('./components/dashBoard/DashBoardsManager.js');
const fs = require('fs');
const ipc = require('electron').ipcRenderer;
const DataReader = require('./components/dataReader/dataReader');
const DashBoard = require('./components/dashBoard/DashBoard');
const TitleBar = require('./components/titleBar/titleBar');
const EventHandler = require('./components/eventHandler/eventHandler');
const InputHandler = require('./components/inputHandler/inputHandler');

class MainWindow {

	constructor() {

		this.DataReader = new DataReader();
		this.SideMenu = new SideMenu();
		this.DashBoardsManager = new DashBoardsManager();
		this.DashBoard = new DashBoard();
		this.TitleBar = new TitleBar();
		this.EventHandler = new EventHandler();
		this.InputHandler = new InputHandler();

	}

	saveConfig() {

		fs.writeFileSync('./assets/config.json', JSON.stringify(window['ZenViewConfig'], null, '\t'));

	}

	changeGlobalContext(context) {

		window.GlobalContext = context;

	}

	readInitialConfig() {

		try {

			window['ZenViewConfig'] = JSON.parse(fs.readFileSync('./assets/config.json'));

		} catch (error) {

			const initialConfig = {
				language: 'ptbr',
				dashboards: [],
			};

			fs.writeFileSync('./assets/config.json', JSON.stringify(initialConfig, null, '\t'));

			window['ZenViewConfig'] = initialConfig;

		}

	}

	init() {

		this.EventHandler.addEventListener('SaveConfigs', () => {

			this.saveConfig();

		});

		this.EventHandler.addEventListener('GlobalContextChange', (evt) => {

			this.changeGlobalContext(evt.context);

		});

		this.readInitialConfig();

	}

	build() {

		let duracao = Date.now();

		this.init();
		this.TitleBar.build();
		this.SideMenu.build();
		this.DashBoardsManager.build();
		this.DataReader.build();
		this.DashBoard.build();
		this.InputHandler.build();

		this.EventHandler.GlobalContextChange({
			context: 'any',
		});

		duracao = Date.now() - duracao; // pega a duracao do load
		console.log('TEMPO DE LOAD: ' + duracao + 'ms');
		duracao = (duracao > 3000) ? 0 : 3000 - duracao; // testa se foram mais de 3 segundos

		ipc.send('mainLoadCompleto', {
			show: true,
		});

		/* setTimeout(() => { // caso n tenha sido espera o gif terminar para chamar a janela principal

			ipc.send('mainLoadCompleto', {
				show: true,
			});

		}, duracao);*/

	}

}

window.onload = () => {

	const App = new MainWindow();
	App.build();

};
