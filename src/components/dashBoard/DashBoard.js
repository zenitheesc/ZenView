const ipcRenderer = require('electron').ipcRenderer;
const GridStack = require('gridstack/dist/gridstack.all');
const hash = require('object-hash');
const BlockContainer = require('../blockContainer/blockContainer');
const EventHandler = require('../eventHandler/eventHandler');
const BSONconverter = require('../../classes/bson');
const DataDashBoard = require('../../classes/dashBoard');
const Dialog = require('../dialog/dialog');

module.exports = class DashBoard {

	constructor() {

		this.DashBoardComponent = document.getElementById('DashBoard');
		this.GridStackComponent = document.getElementById('main_grids_stack');

		this.DashBoardComponent.style.width = String(Math.floor(31 * (screen.width / 32)) + 'px');
		this.GridStackComponent.style.width = String(Math.floor(31 * (screen.width / 32)) + 'px');
		this.blocks = [];
		this.gridStack;

		this.eventHandler = new EventHandler();
		this.BSON = new BSONconverter();

	}

	build() {

		this.gridStack = GridStack.init({
			float: true,
			column: 12,
			animate: true,
			draggable: {
				handle: '.blockHeader',
			},
		});

		this.gridStack.enable('.grid-stack-t dashboardHash = hash(currentDashBoard);tem-content', true);

		this.eventHandler.addEventListener('AddNewBlock', (evt) => {

			this.addNewBlock(evt);

		});

		this.eventHandler.addEventListener('RemoveBlock', (evt) => {

			this.removeBlock(evt);

		});

		this.eventHandler.addEventListener('ClearDashboard', () => {

			this.gridStack.removeAll();
			this.blocks = [];

		});

		this.eventHandler.addEventListener('LoadBlocks', () => {

			this.loadBLocks();

		});

		this.eventHandler.addEventListener('SaveDashboard', (evt) => {

			this.saveDashboard();

		});

		this.eventHandler.addEventListener('StartRead', (evt) => {

			this.gridStack.disable();

		});

		this.eventHandler.addEventListener('StopRead', (evt) => {

			this.gridStack.enable();

		});

		ipcRenderer.on('SaveDashboard', (evt, onClose) => {

			this.saveDashboard(onClose);

		});

		this.eventHandler.addEventListener('ImportDashboard', (evt) => {

			this.importDashboard(evt);

		});

		ipcRenderer.on('ImportDashboard', (evt) => {

			ipcRenderer.send('open-file-dialog-for-file', 'bson');

			ipcRenderer.on('selected-dir', (evt, arg) => {

				this.importDashboard(arg);

				ipc.removeAllListeners('selected-dir');

			});

		});

	}

	addNewBlock(blockConfig) {

		const newBlock = new BlockContainer(blockConfig || {});
		this.blocks.push(newBlock);
		this.gridStack.addWidget(newBlock.htmlComponent, newBlock);

		newBlock.init();
		window.CurrentDashBoard.blocks = this.blocks;

	}

	removeBlock(removedBlock) {

		this.blocks = this.blocks.filter((block) => block !== removedBlock);
		this.gridStack.removeWidget(removedBlock.htmlComponent);
		window.CurrentDashBoard.blocks = this.blocks;

	}

	loadBLocks() {

		window.CurrentDashBoard.blocksLog.forEach((blockLog) => {

			const newBlock = new BlockContainer(blockLog.preConfig, blockLog.title);

			this.gridStack.addWidget(newBlock.htmlComponent, {
				x: Number(blockLog.x),
				y: Number(blockLog.y),
				height: Number(blockLog.h),
				width: Number(blockLog.w),
			});

			newBlock.load(blockLog.blockConfig);
			this.blocks.push(newBlock);
			window.CurrentDashBoard.blocks.push(newBlock);

		});

		this.gridStack.on('added change enable removed', (evt, el) => {

			this.eventHandler.dispatchEvent('DashboardNotSaved');

		});

	}

	saveDashboard(onClose) {

		const currentDashBoard = window.CurrentDashBoard;
		const blocksLog = [];

		this.blocks.forEach((block) => blocksLog.push(block.blockLog()));
		currentDashBoard.blocksLog = blocksLog;
		currentDashBoard.saved = true;

		const tempBlocks = currentDashBoard.blocks;

		currentDashBoard.blocks = [];
		const dashboardHash = hash(currentDashBoard);
		currentDashBoard.hash = dashboardHash;

		this.BSON.writeFile(currentDashBoard.path, currentDashBoard);

		currentDashBoard.blocks = tempBlocks;

		ipcRenderer.send('isSaved', true);

		if (onClose) ipcRenderer.send('closeOnSave');

	}

	importDashboard(path) {

		const dashboardJSON = this.BSON.readFile(path);
		const dashboard = new DataDashBoard(dashboardJSON);

		if (dashboard.blocks.length === 0) {

			dashboard.inputGroup.inputGraph = {};

		}

		const dashboardIdealHash = hash(dashboard);

		if (dashboardJSON.hash === dashboardIdealHash) {

			dashboard.path = path;
			this.eventHandler.dispatchEvent('OpenImportedDashboard', dashboard);

		} else {

			Dialog.showDialog({
				title: 'Error',
				message: 'Este dashboard foi modificado externamente e não pode ser aberto.',
				buttons: ['Ok'],
			});

		}

	}

};
