const fs = require('fs');
const { number } = require('mathjs');
const DashBoard = require('../../classes/dashBoard');
const Dialog = require('../../dialog');

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
		try {
			let CurrentDashBoard = new DashBoard(JSON.parse(fs.readFileSync(path)));
			window.CurrentDashBoard = CurrentDashBoard;
			window.CurrentInputGroup = CurrentDashBoard.inputGroup;
			window.dispatchEvent(new CustomEvent('attInputList'));

			return true;
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

		const dashBoard = new DashBoard(detail.name,number(detail.numberOfInputs), detail.path, detail.desc);
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

		let callback = ((resposta) => {
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

		window.addEventListener('newDashBoard', (evt) => {
			this.newDashBoard(evt.detail);
		});
	}
};