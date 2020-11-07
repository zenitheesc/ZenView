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

		this.EventHandler = new EventHandler();
		this.htmlComponent = document.createElement('div');
		this.htmlComponent.className = 'card inputCard mb-3';
		this.title = this.inputHeader();
		this.expression = this.inputBody();
		this.setEvents();

	}

	inputHeader() {

		const cardHeader = document.createElement('div');
		cardHeader.setAttribute('class', 'card-header row inputCard-header m-0 justify-content-between');

		const cardHeaderTitle = document.createElement('div');
		cardHeaderTitle.innerText = this.inputInfo.name;

		cardHeader.appendChild(cardHeaderTitle);
		cardHeader.appendChild(this.inputButtons());

		this.htmlComponent.appendChild(cardHeader);

		return cardHeaderTitle;

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

	inputBody() {

		const cardBody = document.createElement('div');
		cardBody.className = 'card-body';

		const inputExp = document.createElement('p');
		inputExp.textContent = this.inputInfo.expression;

		cardBody.appendChild(inputExp);

		this.htmlComponent.appendChild(cardBody);

		return inputExp;

	}

	setEvents() {

		this.addBtn.addEventListener('click', () => {

			let tag = document.createElement("a");
			tag.contentEditable = "false";
			tag.className = "inputTag";
			tag.textContent = '${' + this.name + '}';

			this.form.formThree.newDashboardSpliter.expression.input.appendChild(tag);

		});

		this.editBtn.addEventListener('click', () => {

			if (!this.title.isContentEditable) {

				this.editBtn.innerHTML = Components.icon('save');
				this.title.classList.add('editableDiv');
				this.expression.classList.add('editableDiv');
				this.title.contentEditable = true;
				this.expression.contentEditable = true;

			} else {

				this.editBtn.innerHTML = Components.icon('pencil-square');
				this.title.classList.remove('editableDiv');
				this.expression.classList.remove('editableDiv');
				this.title.contentEditable = false;
				this.expression.contentEditable = false;

				/*this.EventHandler.SaveInputNameAndExpression({
					name: this.title.textContent,
					expression: this.expression.textContent,
				});*/

			}

		});

		this.delBtn.addEventListener('click', () => {


		});

	}

};