const ipc = require('electron').ipcRenderer;

module.exports = class Dialog {
	static showDialog(dialogConfig, callBack) {
		callBack = callBack || (() => {});
		ipc.send('openDialog', dialogConfig);

		ipc.on('openDialogResponse', (evt, result) => {
			callBack(result);
		});
	}
};