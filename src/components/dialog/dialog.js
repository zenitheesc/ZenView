const ipc = require('electron').ipcRenderer;

module.exports = class Dialog {

	static showDialog(dialogConfig, callBack) {

		callBack = callBack || (() => {});
		ipc.send('openDialog', dialogConfig);

		/**
		 *
		 *
		 * @param {Event} evt
		 * @param {any} result resultado gerado na janela aberta
		 */
		function insideCallback(evt, result) {

			callBack(result);
			ipc.removeAllListeners('openDialogResponse');

		}

		ipc.on('openDialogResponse', insideCallback);

	}

};