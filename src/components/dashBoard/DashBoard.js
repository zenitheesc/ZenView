const GridStack = require('gridstack/dist/gridstack.all');
const BlockContainer = require('../blockContainer/blockContainer');
const EventHandler = require('../eventHandler/eventHandler');
module.exports = class DahsBoard {

	constructor() {

		this.DashBoardComponent = document.getElementById('DashBoard');
		this.GridStackComponent = document.getElementById('main_grids_stack');

		this.DashBoardComponent.style.width = String(Math.floor(31 * (screen.width / 32)) + 'px');
		this.GridStackComponent.style.width = String(Math.floor(31 * (screen.width / 32)) + 'px');
		this.gridStack;

		this.EventHandler = new EventHandler();

	}

	build() {

		this.gridStack = GridStack.init({
			float: true,
			column: 12,
			animate: true,

		});

		this.gridStack.enable('.grid-stack-item-content', true);

		this.EventHandler.addEventListener('AddNewBlock', (evt) => {

			this.addNewBlock(evt);

		});

		this.EventHandler.addEventListener('ClearDashboard', () => {

			this.gridStack.removeAll();

		});

	}

	addNewBlock(blockConfig) {

		const newBlock = new BlockContainer(blockConfig || {});
		this.gridStack.addWidget(newBlock.htmlComponent, newBlock);

		newBlock.init();

	}

};