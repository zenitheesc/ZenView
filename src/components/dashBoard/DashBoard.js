const ipcRenderer    = require('electron').ipcRenderer;
const GridStack      = require('gridstack/dist/gridstack.all');
const BlockContainer = require('../blockContainer/blockContainer');
const EventHandler   = require('../eventHandler/eventHandler');

module.exports = class DahsBoard {

	constructor() {

		this.DashBoardComponent = document.getElementById('DashBoard');
		this.GridStackComponent = document.getElementById('main_grids_stack');

		this.DashBoardComponent.style.width = String(Math.floor(31 * (screen.width / 32)) + 'px');
		this.GridStackComponent.style.width = String(Math.floor(31 * (screen.width / 32)) + 'px');
		this.blocks = [];
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

		this.EventHandler.addEventListener('RemoveBlock', (evt) => {

			this.removeBlock(evt);

		});

		ipcRenderer.on('SaveDashboard', (evt) => {

			this.saveDashboard();

		});


		ipcRenderer.on('ImportDashboard', (evt) => {

			this.importDashboard();

		});

	}

	addNewBlock(blockConfig) {

		const newBlock = new BlockContainer(blockConfig || {});
		this.blocks.push(newBlock);
		this.gridStack.addWidget(newBlock.htmlComponent, newBlock);

		newBlock.init();

	}

	removeBlock(removedBlock) {

		this.blocks = this.blocks.filter(block => block !== removedBlock);
		this.gridStack.removeWidget(removedBlock.htmlComponent);

	}

	saveDashboard(){

		console.log('Salvou');

		/*
		let blocksLog = [];
		this.blocks.forEach((block) => blocksLog.push(block.blockLog()));
		console.log(blocksLog);
		
		const currentDashBoard = window.CurrentDashBoard;
		currentDashBoard.blocks = blocksLog;
		fs.writeFile(currentDashBoard.path, JSON.stringify(currentDashBoard, null, '\t'));
		*/

	}

	importDashboard() {

		console.log('Importou');

	}

};