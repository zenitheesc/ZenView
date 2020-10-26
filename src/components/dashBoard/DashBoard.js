const GridStack = require('gridstack/dist/gridstack.all');
module.exports = class DahsBoard {

	constructor() {

		this.DashBoardComponent = document.getElementById('DashBoard');
		this.GridStackComponent = document.getElementById('main_grids_stack');

		this.DashBoardComponent.style.width = String(Math.floor(31 * (screen.width / 32)) + 'px');
		this.GridStackComponent.style.width = String(Math.floor(31 * (screen.width / 32)) + 'px');
		this.gridStack;

	}

	build() {

		this.gridStack = GridStack.init({
			float: true,
			column: 12,
			animate: true,

		});

		this.gridStack.enable('.grid-stack-item-content', true);

		window.addEventListener('AddNewBlock', () => {

			this.addNewBlock();

		});

		window.addEventListener('ClearDashboard', () => {

			this.gridStack.removeAll();

		});

	}

	addNewBlock() {

		const newBlock = {};
		newBlock.height = (newBlock.height === undefined) ? 3 : newBlock.height;
		newBlock.width = (newBlock.width === undefined) ? 4 : newBlock.width;

		const div = document.createElement('div');
		div.className = 'grid-stack-item';
		this.gridStack.addWidget('<div><div class="grid-stack-item-content"><br></div></div>', newBlock);

	}

};