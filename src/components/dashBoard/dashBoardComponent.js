const fs = require('fs');
const DashBoard = require('../../classes/dashBoard');
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

			window['ZenViewConfig'].lastDasboard = JSON.parse(DashBoard);
			window.dispatchEvent(new CustomEvent('attInputList'));

			return true;
		} catch (error) {
			alert('Este dashboard foi movido de seu diretório ou excluído');
			for (var i = window['ZenViewConfig'].dashboards.length - 1; i >= 0; i--) {
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
		let answer = confirm('Are you shure?');

		if (answer === true) {
			console.log(path);
			fs.unlinkSync(path);

			for (var i = window['ZenViewConfig'].dashboards.length - 1; i >= 0; i--) {
				if (window['ZenViewConfig'].dashboards[i].path === path) {
					window['ZenViewConfig'].dashboards.splice(i, 1);
					window.dispatchEvent(new CustomEvent('attDashBoardsList'));
					window.dispatchEvent(new CustomEvent('saveConfigs'));
					this.changeGlobalContext('all');
					break;
				}
			}
		}
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