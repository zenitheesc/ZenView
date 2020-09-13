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
	editingDashBoard(details) {
		console.log('iniciando dashboard para edição');
		let DashBoard = fs.readFileSync(details.dashBoardPath);
		window['ZenViewConfig'].lastDasboard = DashBoard;
		this.changeGlobalContext('editing');
	}
	startDashboard(details) {
		console.log('iniciando dashboard para leitura');
		let DashBoard = fs.readFileSync(details.dashBoardPath);
		window['ZenViewConfig'].lastDasboard = DashBoard;
		this.changeGlobalContext('start');
	}
	newDashBoard(detail) {
		window['ZenViewConfig'].dashboards.unshift({
			'name': detail.name,
			'path': detail.path,
			'desc': detail.desc
		});

		fs.writeFileSync('./src/config.json', JSON.stringify(window['ZenViewConfig'], null, '\t'));

		let dashBoard = new DashBoard(detail.name, detail.numberOfInputs, detail.path, detail.desc);

		fs.writeFileSync(detail.path, JSON.stringify(dashBoard, null, '\t'));
		window.dispatchEvent(new CustomEvent('openDashBoard', {
			detail: {
				context: 'editing',
				dashBoardPath: detail.path
			}
		}));
	}
	build() {
		window.addEventListener('openDashBoard', (evt) => {
			if (evt.detail.context === 'editing') {
				this.editingDashBoard(evt.detail);
			} else {
				this.startDashboard(evt.detail);
			}
		});

		window.addEventListener('newDashBoard', (evt) => {
			this.newDashBoard(evt.detail);
		});
	}
};