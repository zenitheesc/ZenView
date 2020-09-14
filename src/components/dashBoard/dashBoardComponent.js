const fs = require('fs');
const DashBoard = require('../../classes/dashBoard');
const Dialog = require('../../dialog');
//const dialog = remote.require('dialog');

module.exports = class DashBoardComponent {
	changeGlobalContext(newContext) {
		window.dispatchEvent(new CustomEvent('GlobalContextChange', {
			detail: {
				context: newContext,
			}
		}));
	}
	openDashBoard(path) {
		try {
			let DashBoard = fs.readFileSync(path);

			window['ZenViewConfig'].currentDashBoard = JSON.parse(DashBoard);
			window.dispatchEvent(new CustomEvent('attInputList'));

			return true;
		} catch (error) {
			Dialog.showDialog({
				title: 'Error',
				message: 'Este dashboard foi movido de seu diretório ou excluído',
				buttons: ['Ok']
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
		console.log('iniciando dashboard para edição');
		if (this.openDashBoard(details.dashBoardPath)) this.changeGlobalContext('editing');
	}
	startDashboard(details) {
		console.log('iniciando dashboard para leitura');
		if (this.openDashBoard(details.dashBoardPath)) this.changeGlobalContext('start');
	}
	newDashBoard(detail) {
		window['ZenViewConfig'].dashboards.unshift({
			'name': detail.name,
			'path': detail.path,
			'desc': detail.desc
		});

		let dashBoard = new DashBoard(detail.name, detail.numberOfInputs, detail.path, detail.desc);

		fs.writeFileSync(detail.path, JSON.stringify(dashBoard, null, '\t'));

		window.dispatchEvent(new CustomEvent('saveConfigs'));

		window.dispatchEvent(new CustomEvent('attDashBoardsList'));

		window.dispatchEvent(new CustomEvent('openDashBoard', {
			detail: {
				context: 'editing',
				dashBoardPath: detail.path
			}
		}));
	}
	deleteDashboard(path) {
		Dialog.showDialog({
			title: 'Confirmar',
			type: 'error',
			buttons: ['Sim', 'Não'],
			message: 'Você tem certeza que deseja deletar o dashboard?',
		}, (resposta) => {
			if (resposta.response === 0) {
				fs.unlinkSync(path);
				for (let i = window['ZenViewConfig'].dashboards.length - 1; i >= 0; i--) {
					if (window['ZenViewConfig'].dashboards[i].path === path) {
						window['ZenViewConfig'].dashboards.splice(i, 1);
						window.dispatchEvent(new CustomEvent('attDashBoardsList'));
						window.dispatchEvent(new CustomEvent('saveConfigs'));
						this.changeGlobalContext('all');
						break;
					}
				}
			}
		});
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