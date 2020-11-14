const EventHandler = require('../../../eventHandler/eventHandler');
const Components = require('../../../components');	

module.exports = class InputCard {

	constructor(name, expression, form) {

		this.inputInfo = {
			'name': name,
			'expression': expression,
		};

		this.name = name;
		this.form = form;

		this.eventHandler = new EventHandler();
		this.htmlComponent = document.createElement('div');
		this.htmlComponent.className = 'mb-3';
		[this.title, this.icon] = this.inputHeader();
		this.setEvents();

	}

	inputHeader() {

		const cardHeader = document.createElement('div');
		cardHeader.setAttribute('class', 'row inputCard m-0 justify-content-between');

		const cardHeaderIcon = document.createElement('i');
		cardHeaderIcon.className = 'fas fa-list-ol inputCardIcon';

		const cardHeaderTitle = document.createElement('div');
		cardHeaderTitle.className = 'inputCardTitle';
		cardHeaderTitle.innerText = this.inputInfo.name;
		
		const cardHeaderWrapper = document.createElement('div');
		cardHeaderWrapper.className = 'row m-0 inputCardWrapper';

		cardHeaderWrapper.appendChild(cardHeaderIcon);
		cardHeaderWrapper.appendChild(cardHeaderTitle);

		cardHeader.appendChild(cardHeaderWrapper);
		cardHeader.appendChild(this.inputButtons());

		this.htmlComponent.appendChild(cardHeader);

		return [cardHeaderTitle, cardHeaderIcon];

	}

	inputButtons() {

		const cardButtons = document.createElement('div');

		this.addBtn = Components.buttonWithIcon('plus-square', 'inputCardOption');
		this.editBtn = Components.buttonWithIcon('pencil-square', 'inputCardOption');
		this.delBtn = Components.buttonWithIcon('trash', 'inputCardOption');

		cardButtons.appendChild(this.addBtn);
		cardButtons.appendChild(this.editBtn);
		cardButtons.appendChild(this.delBtn);

		return cardButtons;

	}

	setEvents() {

		this.htmlComponent.addEventListener('mouseover', () => {
			
			this.title.innerText = this.inputInfo.expression;
			
		});
		
		this.htmlComponent.addEventListener('mouseout', () => {
			
			this.title.innerText = this.inputInfo.name;
			
		});

		this.addBtn.addEventListener('click', () => {

			const tag = document.createElement("a");
			tag.contentEditable = "false";
			tag.className = "inputTag";
			tag.textContent = '${' + this.name + '}';

			this.form.formThree.newDashboardSpliter.expression.input.appendChild(tag);

		});

		this.editBtn.addEventListener('click', () => {



		});

		this.delBtn.addEventListener('click', () => {

			window.CurrentInputGroup.removeInput(this.name, 'input');
			this.eventHandler.dispatchEvent('AttInputList');

		});

	}

};