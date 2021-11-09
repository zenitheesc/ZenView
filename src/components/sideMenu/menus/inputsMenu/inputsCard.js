const EventHandler = require('../../../eventHandler/eventHandler');
const Components = require('../../../components');

module.exports = class InputCard {

	constructor(input) {

		this.inputInfo = {
			'name': input.name,
			'expression': input.expression.formatted,
			'rawExpression': input.expression.raw,
			'hasInconsistency': input.hasInconsistency,
		};

		this.eventHandler = new EventHandler();
		this.htmlComponent = document.createElement('div');
		this.htmlComponent.className = 'mb-3';
		this.title = this.inputHeader();
		this.setEvents();

	}

	inputHeader() {

		const cardHeader = document.createElement('div');
		cardHeader.setAttribute('class', 'row  m-0 justify-content-between');

		if (this.inputInfo.hasInconsistency) {

			cardHeader.classList.add('inputCardWithError');

		} else {

			cardHeader.classList.add('inputCard');

		}

		const cardHeaderIcon = document.createElement('i');
		cardHeaderIcon.innerHTML = Components.icon('list-ol-solid');
		cardHeaderIcon.className = 'inputCardIcon';

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

		return cardHeaderTitle;

	}

	inputButtons() {

		const cardButtons = document.createElement('div');

		this.addBtn = Components.buttonWithIcon('plus-square', 'inputCardOption');
		this.editBtn = Components.buttonWithIcon('pencil-square', 'inputCardOption');
		this.delBtn = Components.buttonWithIcon('trash-alt-regular', 'inputCardOption trashInputCardOption');

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

			const tag = document.createElement('a');
			tag.contentEditable = 'false';
			tag.className = 'inputTag';
			tag.textContent = '${' + this.inputInfo.name + '}';

			this.eventHandler.dispatchEvent('AppendTag', {tag: tag});

		});

		this.editBtn.addEventListener('click', () => {

			this.eventHandler.dispatchEvent('SetEditInputMode', {name: this.inputInfo.name, exp: this.inputInfo.rawExpression});

		});

		this.delBtn.addEventListener('click', () => {

			this.eventHandler.RemoveInput({
				name: this.inputInfo.name,
			});

			this.eventHandler.dispatchEvent('AttInputList');

		});

	}

};