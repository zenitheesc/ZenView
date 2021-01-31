const fs = require('fs');
const number = require('mathjs').number;
const DashBoard = require('../../classes/dashBoard');
const BSONconverter = require('../../classes/bson');
const Dialog = require('../dialog/dialog');
const ConfirmationDialog = require('../dialog/confirmationDialog');
const EventHandler = require('../eventHandler/eventHandler');

module.exports = class DashBoardsManager {

	constructor() {

		this.EventHandler = new EventHandler();
		this.BSON = new BSONconverter();

	}

	changeGlobalContext(newContext) {

		this.EventHandler.GlobalContextChange({
			context: newContext,
		});

	}

	testIfDashBoardExist(path) {

		try {

			if (fs.existsSync(path)) return true;
			else {

				Dialog.showDialog({
					title: 'Error',
					message: 'Este dashboard foi movido de seu diretório ou excluído',
					buttons: ['Ok'],
				});
				for (let i = window['ZenViewConfig'].dashboards.length - 1; i >= 0; i--) {

					if (window['ZenViewConfig'].dashboards[i].path === path) {

						window['ZenViewConfig'].dashboards.splice(i, 1);

						this.EventHandler.AttDashBoardsList();
						this.EventHandler.SaveConfigs();

						break;

					}

				}
				return false;
			
			}
			
		} catch (err) {

			console.log(err);
			return false;

		}

	}

	openDashBoard(path) {

		console.log('ABRINDO NOVO DASHBOARD');
		this.EventHandler.dispatchEvent('ClearDashboard');
		if (!this.testIfDashBoardExist(path)) return;

		const CurrentDashBoardConfig = this.BSON.readFile(path);
		const CurrentDashBoard = new DashBoard(CurrentDashBoardConfig);

		window.CurrentDashBoard = CurrentDashBoard;
		window.CurrentInputGroup = CurrentDashBoard.inputGroup;
		window.scope = CurrentDashBoard.inputGroup.scope;

		this.EventHandler.InitInputs();
		this.EventHandler.AttInputList();
		this.EventHandler.InitBlocks();
		this.EventHandler.DashboardWasOpened();
		
		return true;

	}

	editingDashBoard(details) {

		if (this.openDashBoard(details.dashBoardPath)) this.changeGlobalContext('editing');

	}

	startDashboard(details) {

		if (this.openDashBoard(details.dashBoardPath)) this.changeGlobalContext('start');

	}

	newDashBoard(detail) {

		console.log('CRIANDO NOVO DASHBOARD');
		window['ZenViewConfig'].dashboards.unshift({
			'name': detail.name,
			'path': detail.path,
			'desc': detail.desc,
		});

		const dashBoard = new DashBoard(detail.name, number(detail.numberOfInputs), detail.path, detail.desc);
		dashBoard.inputGroup.inputGraph = {};
		this.BSON.writeFile(detail.path, dashBoard);

		this.EventHandler.SaveConfigs();
		this.EventHandler.AttDashBoardsList();

		this.EventHandler.OpenDashBoard({

			context: 'editing',
			dashBoardPath: detail.path,

		});

	}

	deleteDashboard(deletePath) {

		if (!this.testIfDashBoardExist(deletePath)) return;
		const callback = ((resposta) => {

			if (resposta.response === 0) {

				fs.unlinkSync(deletePath);
				for (let i = window['ZenViewConfig'].dashboards.length - 1; i >= 0; i--) {

					if (window['ZenViewConfig'].dashboards[i].path === deletePath) {

						window['ZenViewConfig'].dashboards.splice(i, 1);

						this.EventHandler.AttDashBoardsList();
						this.EventHandler.SaveConfigs();

						break;

					}

				}

			}

		});

		Dialog.showDialog({
			title: 'Confirmar',
			type: 'error',
			buttons: ['Sim', 'Não'],
			message: 'Você tem certeza que deseja deletar o dashboard?',
		}, callback);

	}

	saveDashBoardDescAndName(path, newName, newDesc) {

		for (let i = window['ZenViewConfig'].dashboards.length - 1; i >= 0; i--) {

			if (window['ZenViewConfig'].dashboards[i].path === path) {

				if (!this.testIfDashBoardExist(path)) return;

				const CurrentDashBoardConfig = this.BSON.readFile(path);
				const CurrentDashBoard = new DashBoard(CurrentDashBoardConfig);

				CurrentDashBoard.name = newName;
				CurrentDashBoard.description = newDesc;
				CurrentDashBoard.inputGroup.inputGraph = {};

				this.BSON.writeFile(path, CurrentDashBoard);

				window['ZenViewConfig'].dashboards[i].desc = newDesc;
				window['ZenViewConfig'].dashboards[i].name = newName;

				this.EventHandler.SaveConfigs();
				this.EventHandler.AttDashBoardsList();

				break;

			}

		}

	}

	saveCurrentDashBoard() {

		const currentDashBoard = window.CurrentDashBoard;
		const tempGraph = currentDashBoard.inputGroup.inputGraph;
		currentDashBoard.inputGroup.inputGraph = {};
		this.BSON.writeFile(currentDashBoard.path, currentDashBoard);
		window.CurrentDashBoard.inputGroup.inputGraph = tempGraph;

	}

	build() {

		this.EventHandler.addEventListener('OpenDashBoard', (evt) => {

			if (window.CurrentDashBoard !== undefined && !window.CurrentDashBoard.saved) {
				
				ConfirmationDialog.showConfirmationDialog(evt, (evt) => {
					
					if (evt.context === 'editing') this.editingDashBoard(evt);
					else this.startDashboard(evt);
				
				});
			
			} else {

				if (evt.context === 'editing') this.editingDashBoard(evt);
				else this.startDashboard(evt);
	
			}
			
			
		});

		this.EventHandler.addEventListener('DeleteDashboard', (evt) => {

			this.deleteDashboard(evt.dashBoardPath);

		});

		this.EventHandler.addEventListener('SaveCurrentDashBoard', (evt) => {

			this.saveCurrentDashBoard();

		});

		this.EventHandler.addEventListener('NewDashBoard', (evt) => {

			this.newDashBoard(evt);

		});

		this.EventHandler.addEventListener('SaveDashBoardDescAndName', (evt) => {

			this.saveDashBoardDescAndName(evt.path, evt.name, evt.desc);

		});

	}

};