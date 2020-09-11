const Menu = require('../menu');
const Components = require('../../../components.js');
module.exports = class newDashBoardMenu extends Menu {
	constructor() {
		super('New Dashboard', 'newDashboard_menu');
		this.createButton;
		this.form;
		this.logicComponent;
	}
	LoadAddNewDashBoardButton() {
		this.createButton = document.createElement('button');
		this.createButton.style.width = '50%';
		this.createButton.style.marginLeft = '25%';
		this.createButton.style.marginRight = '25%';
		this.createButton.className = 'green-btn';
		this.createButton.textContent = 'Criar';
		this.createButton.type = 'button'; 
	}
	newDashboardSpliter() {
		this.form = document.createElement('form');

		let dashBoardNameInput = Components.textInput('Nome', 'newDashBoardNameInput');
		let dashBoardPath = Components.pathInput('Diretório', 'newDashsBoardPath');
		let dashBoardNbmrOfInputs = Components.numberInput('Número de entradas', 'newDashBoardNbmrOfInputs', 1, 30);
		let dashBoardDescription = Components.textArea('Descrição', 'newDashBoardDescription');
		dashBoardDescription.childNodes[1].style.height = '16em';

		this.LoadAddNewDashBoardButton();

		this.form.appendChild(dashBoardNameInput);
		this.form.appendChild(dashBoardPath);
		this.form.appendChild(dashBoardNbmrOfInputs);
		this.form.appendChild(dashBoardDescription);
		this.form.appendChild(this.createButton);

		let spliter = Components.spliter('newDashboard', 'Criar novo Dashboard', this.form, true);

		return spliter;
	}
	importDashBoardSpliter() {
		let container = document.createElement('div');

		let spliter = Components.spliter('importDashboard', 'Importar Dashboard', container, true);

		return spliter;
	}
	load() {
		let spliterContainer = document.createElement('div');
		spliterContainer.className = 'menuBody';

		spliterContainer.appendChild(this.newDashboardSpliter());
		spliterContainer.appendChild(this.importDashBoardSpliter());

		this.menuComponent.appendChild(spliterContainer);
		this.logicComponent = new newDashBoardMenuLogic(this.createButton,this.form);
	}
};

class newDashBoardMenuLogic{
	constructor(createDashBoardButton,createDashBoardForm){
		this.createButton = createDashBoardButton;
		this.form = createDashBoardForm;
		this.createButton.addEventListener('click', () => this.getData(this.form.elements));
	}
	getData(data){
		console.log(data);
		const name = this.validateName(data[0].value);
		const path = this.validateName(data[1].value);
		const nbmrInput = this.validateName(data[2].value);
		const description = this.validateName(data[4].value);
		let validName = this.validateName(name);
		let validePath = this.validatePath(path);
		let validInputNbmr = this.validateInput(nbmrInput);
		let validDescription = this.validateDesc(description);
		if(validName === true && validePath === true &&  validInputNbmr === true && validDescription === true){

		}
		return;
	}
	isEmpty(value){
		return (value === '' || value === undefined)? true : false;
	}
	contarinSpecialChars(value){
		const format = /[ `!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
		return format.test(value);
	}
	validateName(name){
		if(this.isEmpty(name)){
			this.displayErrorMsg();
		}
	}
	validatePath(path){

	}
	validateInput(inputNbmr){

	}
	validateDesc(description){
		return true;
	}
	displayErrorMsg(id,message){

	}
	hideErrorMsg(id){

	}
}