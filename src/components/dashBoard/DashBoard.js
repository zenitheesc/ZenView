const ipcRenderer = require('electron').ipcRenderer;
const GridStack = require('gridstack/dist/gridstack.all');
const BlockContainer = require('../blockContainer/blockContainer');
const EventHandler = require('../eventHandler/eventHandler');
const fs = require('fs');

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
		
		this.EventHandler.addEventListener('RemoveBlock', (evt) => {
			
			this.removeBlock(evt);
			
		});
		
		this.EventHandler.addEventListener('ClearDashboard', () => {

			this.gridStack.removeAll();
			this.blocks = [];

		});

		this.EventHandler.addEventListener('InitBlocks', () => {

			this.initBlocks();

		});

		ipcRenderer.on('SaveDashboard', (evt) => {

			this.saveDashboard();

		});

		this.EventHandler.addEventListener('ImportDashboard', (evt) => {

			this.importDashboard(evt);

		});

		ipcRenderer.on('ImportDashboard', (evt) => {

			// TODO: Abrir caixa de escolha de diretório

			this.importDashboard(evt);

		});

	}

	addNewBlock(blockConfig) {

		const newBlock = new BlockContainer(blockConfig || {});
		this.blocks.push(newBlock);
		this.gridStack.addWidget(newBlock.htmlComponent, newBlock);

		newBlock.init();

	}

	removeBlock(removedBlock) {

		this.blocks = this.blocks.filter((block) => block !== removedBlock);
		this.gridStack.removeWidget(removedBlock.htmlComponent);

	}

	initBlocks() {

		window.CurrentDashBoard.blocks.forEach((block) => {

			const newBlock = new BlockContainer(block.preConfig);
			
			this.gridStack.addWidget(newBlock.htmlComponent, {
				x: Number(block.x),
				y: Number(block.y),
				height: Number(block.h),
				width: Number(block.w),
			});

			this.blocks.push(newBlock);
			newBlock.init();
			
		});

	}

	saveDashboard() {
		
		const blocksLog = [];
		this.blocks.forEach((block) => blocksLog.push(block.blockLog()));
		
		const currentDashBoard = window.CurrentDashBoard;
		currentDashBoard.blocks = blocksLog;
		fs.writeFile(currentDashBoard.path, JSON.stringify(currentDashBoard, null, '\t'), (err) => {

			if (err) throw err;
			console.log('Salvou');
			
		});

	}

	importDashboard(path) {

		console.log('Importou: ' + path);
		console.log('Abriu novo dashboard');

	}

};