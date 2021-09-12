console.log('running....');

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const ipc = electron.ipcMain;
const dialog = require('electron').dialog;
const TitleBarMenu = require('./components/titleBar/titleBarMenu');
const fs = require('fs'); 

const debugMode = true;
let initialWindow;
let mainWindow;
let titleBarMenu;
let dashboardIsSaved = true;

// parametros iniciais da janela inicial
const initialWindowparams = {
	frame: false,
	titleBarStyle: 'hidden',
	width: 539,
	height: 170,
	resizable: false,
	show: false,
	path: '../src/initialWindow/initialWindow.html',
	openDevTools: false,
};

// parametros iniciais da janela principal
const mainWindowparams = {
	title: 'ZenView',
	path: '../src/index.html',
	frame: false,
	width: 1024,
	height: 600,
	show: debugMode,
	webPreferences: {
		nodeIntegration: true,
		webviewTag: true,
		nodeIntegrationInWorker: true,
		enableRemoteModule: true,
	},
	openDevTools: debugMode,
};

/**
 * cria uma nova janela a partir dos parametros dados
 * @param {object} params objeto que descreve a nova janela
 * @return {window} janela que foi criada
 */
function createWindow(params) {

	let window = new BrowserWindow(params);
	window.loadURL(url.format({
		pathname: path.join(__dirname, params.path),
		protocol: 'file',
		slashes: true,
	}));
	if (params.openDevTools) {

		window.openDevTools();

	}
	window.on('closed', () => {

		window = null;

	});
	if (!debugMode) window.removeMenu();
	return window;

}
// event listener que espera o app ser criado para criar as janelas
app.on('ready', () => {

	app.allowRendererProcessReuse = false;

	initialWindow = createWindow(initialWindowparams);
	mainWindow = createWindow(mainWindowparams);
	titleBarMenu = new TitleBarMenu();

	// apenas mostrara a janela quando estiver pronta
	initialWindow.once('ready-to-show', () => {

		initialWindow.show();

	});

	mainWindow.on('close', (evt) => {
		
		if (!dashboardIsSaved) {
		
			const response = dialog.showMessageBoxSync(mainWindow, {
				type: 'question',
				buttons: ['Salvar', 'Descartar', 'Cancelar'],
				title: 'Confirmação',
				message: 'Esse dashboard ainda não foi salvo',
				defaultId: 2,
				cancelId: 2,
			});
			
			if (response === 0) {
		
				evt.preventDefault();
				mainWindow.webContents.send('SaveDashboard', true);

			} else if (response === 2) {
		
				evt.preventDefault();
		
			}
	
		}

	});

});

// encerra o programa se todas as janelas forem fechadas
app.on('window-all-closed', () => {

	if (process.platform !== 'darwin') {

		app.quit();

	}

});

// caso a janela nao tenha sido criada força sua criação
app.on('activate', () => {

	if (mainWindow === null) {

		createWindow(initialWindow);
		createWindow(mainWindow);

	}

});

// listerner que avisa que o load da janela principal terminou
ipc.on('mainLoadCompleto', () => {

	initialWindow.close();
	mainWindow.show();

});

ipc.on('open-file-dialog-for-dir', async (event) => {

	const dir = await dialog.showOpenDialog(mainWindow, {

		properties: ['openDirectory', 'createDirectory'],
	});
	if (dir) {

		event.sender.send('selected-dir', dir.filePaths[0]);

	}

});

ipc.on('open-file-dialog-for-file', async (event, args) => {

	const file = await dialog.showOpenDialog(mainWindow, {
		properties: ['openFile'],
		filters: [{name: 'Dashboard', extensions: [args]}],
	});
	if (file) {

		event.sender.send('selected-dir', file.filePaths[0]);

	}

});

ipc.on('openDialog', (event, config) => {

	dialog.showMessageBox(mainWindow, config).then((response) => {

		event.sender.send('openDialogResponse', response);

	});

});

ipc.on('display-app-titleBar', function(err, args) {

	const titleBarMenu = new TitleBarMenu();

	if (mainWindow) {

		titleBarMenu.menu.popup({
			window: mainWindow,
			x: args.x,
			y: args.y,
		});

	}

});

ipc.on('isSaved', (evt, args) => {

	dashboardIsSaved = args;

});

ipc.on('closeOnSave', (evt) => {

	mainWindow.close();

});