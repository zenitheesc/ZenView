const EventHandler = require('../../../eventHandler/eventHandler');
const Components = require('../../../components');	

module.exports = class RawInputCard {

	constructor(name, form) {

		this.rawInputInfo = {
			'name': name,
		};

		this.name = name;
		this.form = form;

		this.EventHandler = new EventHandler();
		this.htmlComponent = document.createElement('li');
		this.htmlComponent.className = 'card rawInputCard';
		this.title = this.inputHeader();
		this.setEvents();

	}

	inputHeader() {

		const cardHeader = document.createElement('div');
		cardHeader.setAttribute('class', 'card-header row rawInputCard-header m-0 justify-content-between');

		const cardHeaderTitle = document.createElement('div');
		cardHeaderTitle.innerText = this.rawInputInfo.name;

		cardHeader.appendChild(cardHeaderTitle);
		cardHeader.appendChild(this.inputButtons());

		this.htmlComponent.appendChild(cardHeader);

		return cardHeaderTitle;

	}

	inputButtons() {

		const cardButtons = document.createElement('div');

		this.addBtn = Components.buttonWithIcon('plus-square', 'rawInputCardOption');
		this.editBtn = Components.buttonWithIcon('pencil-square', 'rawInputCardOption');

		cardButtons.appendChild(this.addBtn);
		cardButtons.appendChild(this.editBtn);

		return cardButtons;

	}

	setEvents() {

		this.addBtn.addEventListener('click', () => {

			let tag = document.createElement("a");
			tag.contentEditable = "false";
			tag.className = "inputTag";
			tag.textContent = '#{' + this.name + '}';

			this.form.formThree.newDashboardSpliter.expression.input.appendChild(tag);

		});

		this.editBtn.addEventListener('click', () => {

			if (!this.title.isContentEditable) {

				this.editBtn.innerHTML = Components.icon('save');
				this.title.classList.add('editableDiv');
				this.title.contentEditable = true;

			} else {

				this.editBtn.innerHTML = Components.icon('pencil-square');
				this.title.classList.remove('editableDiv');
				this.title.contentEditable = false;

				/*this.EventHandler.SaveInputNameAndExpression({
					name: this.title.textContent,
					expression: this.expression.textContent,
				});*/

			}

		});

	}

};