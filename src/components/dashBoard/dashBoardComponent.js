const fs = require('fs');
const {
	number,
} = require('mathjs');
const DashBoard = require('../../classes/dashBoard');
const Dialog = require('../dialog/dialog');

module.exports = class DashBoardComponent {

	changeGlobalContext(newContext) {

		window.dispatchEvent(new CustomEvent('GlobalContextChange', {
			detail: {
				context: newContext,
			},
		}));

	}

	openDashBoard(path) {

		console.log('ABRINDO NOVO DASHBOARD');
		let CurrentDashBoardConfig;
		try {

			CurrentDashBoardConfig = JSON.parse(fs.readFileSync(path));

		} catch (error) {

			console.log(error);
			Dialog.showDialog({
				title: 'Error',
				message: 'Este dashboard foi movido de seu diretório ou excluído',
				buttons: ['Ok'],
			});
			for (let i = window['ZenViewConfig'].dashboards.length - 1; i >= 0; i--) {

				if (window['ZenViewConfig'].dashboards[i].path === path) {

					window['ZenViewConfig'].dashboards.splice(i, 1);
					window.dispatchEvent(new CustomEvent('attDashBoardsList'));
					window.dispatchEvent(new CustomEvent('saveConfigs'));

					break;

				}

			}
			return false;

		}
		const CurrentDashBoard = new DashBoard(CurrentDashBoardConfig);
		window.CurrentDashBoard = CurrentDashBoard;
		window.CurrentInputGroup = CurrentDashBoard.inputGroup;
		window.scope = CurrentDashBoard.inputGroup.scope;
		window.dispatchEvent(new CustomEvent('attInputList'));
		return true;

	}

	editingDashBoard(details) {

		if (this.openDashBoard(details.dashBoardPath)) this.changeGlobalContext('editing');

	}

	startDashboard(details) {

		if (this.openDashBoard(details.dashBoardPath)) this.changeGlobalContext('start');

	}

	newDashBoard(detail) {

		console.log('CRIANDO NOVO DASHBOARD');
		window['ZenViewConfig'].dashboards.unshift({
			'name': detail.name,
			'path': detail.path,
			'desc': detail.desc,
		});

		const dashBoard = new DashBoard(detail.name, number(detail.numberOfInputs), detail.path, detail.desc);
		dashBoard.inputGroup.inputGraph = {};
		fs.writeFileSync(detail.path, JSON.stringify(dashBoard, null, '\t'));

		window.dispatchEvent(new CustomEvent('saveConfigs'));

		window.dispatchEvent(new CustomEvent('attDashBoardsList'));

		window.dispatchEvent(new CustomEvent('openDashBoard', {

			detail: {
				context: 'editing',
				dashBoardPath: detail.path,
			},

		}));

	}

	deleteDashboard(deletePath) {

		const callback = ((resposta) => {

			if (resposta.response === 0) {

				fs.unlinkSync(deletePath);
				for (let i = window['ZenViewConfig'].dashboards.length - 1; i >= 0; i--) {

					if (window['ZenViewConfig'].dashboards[i].path === deletePath) {

						window['ZenViewConfig'].dashboards.splice(i, 1);

						window.dispatchEvent(new CustomEvent('attDashBoardsList'));
						window.dispatchEvent(new CustomEvent('saveConfigs'));

						break;

					}

				}

			}

		});

		Dialog.showDialog({
			title: 'Confirmar',
			type: 'error',
			buttons: ['Sim', 'Não'],
			message: 'Você tem certeza que deseja deletar o dashboard?',
		}, callback);

	}

	saveDashBoardDescAndName(path, newName, newDesc) {

		for (let i = window['ZenViewConfig'].dashboards.length - 1; i >= 0; i--) {

			if (window['ZenViewConfig'].dashboards[i].path === path) {

				window['ZenViewConfig'].dashboards[i].description = newDesc;
				window['ZenViewConfig'].dashboards[i].name = newName;

				window.dispatchEvent(new CustomEvent('attDashBoardsList'));
				window.dispatchEvent(new CustomEvent('saveConfigs'));

				break;

			}

		}

	}

	saveCurrentDashBoard() {

		const currentDashBoard = window.CurrentDashBoard;
		const tempGraph = currentDashBoard.inputGroup.inputGraph;
		currentDashBoard.inputGroup.inputGraph = {};
		fs.writeFileSync(currentDashBoard.path, JSON.stringify(currentDashBoard, null, '\t'));
		window.CurrentDashBoard.inputGroup.inputGraph = tempGraph;

	}

	build() {

		window.addEventListener('openDashBoard', (evt) => {

			if (evt.detail.context === 'editing') {

				this.editingDashBoard(evt.detail);

			} else {

				this.startDashboard(evt.detail);

			}

		});

		window.addEventListener('deleteDashboard', (evt) => {

			this.deleteDashboard(evt.detail.dashBoardPath);

		});

		window.addEventListener('saveCurrentDashBoard', (evt) => {

			this.saveCurrentDashBoard();

		});

		window.addEventListener('newDashBoard', (evt) => {

			this.newDashBoard(evt.detail);

		});

	}

};