const ipc = require('electron').ipcRenderer;

module.exports = class Dialog {

	static showDialog(dialogConfig, callBack) {

		callBack = callBack || (()=>{});
		ipc.send('openDialog', dialogConfig);

		function insideCallback(evt, result) {

			callBack(result);
			ipc.removeAllListeners('openDialogResponse');

		}

		ipc.on('openDialogResponse', insideCallback);

	}

};