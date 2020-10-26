const GridStack = require('gridstack/dist/gridstack.all');
const Block = require('../block/block');
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

	addNewBlock(blockConfig) {

		const newBlock = new Block(blockConfig || {});
		this.gridStack.addWidget(newBlock.htmlComponent, newBlock);

	}

};