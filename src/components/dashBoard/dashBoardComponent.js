const fs = require('fs');

module.exports = class DashBoardComponent {
	changeGlobalContext(newContext){
		window.dispatchEvent(new CustomEvent('GlobalContextChange', {
			detail: {
				context: newContext,
			}
		}));
	}
	editingDashBoard(details) {
		console.log('iniciando dashboard para edição');
		let DashBoard = fs.readFileSync(details.dashBoardPath);
		window['ZenViewConfig'].lastDasboard = 
		this.changeGlobalContext('editing');
	}
	startDashboard(details) {
		console.log('iniciando dashboard para leitura');
		let DashBoard = fs.readFileSync(details.dashBoardPath);
		this.changeGlobalContext('start');
	}
	build() {
		window.addEventListener('openDashBoard', (evt) => {
			if (evt.detail.context === 'editing') {
				this.editingDashBoard(evt.detail);
			} else {
				this.startDashboard(evt.detail);
			}
		});
	}
}