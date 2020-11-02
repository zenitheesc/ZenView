const EventHandler = require('../../../eventHandler/eventHandler');
const Components = require('../../../components');

module.exports = class DashBoardCard {

	constructor(name, desc, path) {

		this.dashBoardInfo = {
			'name': name,
			'desc': desc,
			'path': path,
		};

		this.EventHandler = new EventHandler();
		this.htmlComponent = document.createElement('div');
		this.htmlComponent.className = 'card dashBoardCard mb-3';
		this.title = this.dashBoardHeader();
		this.desc = this.dashBoardBody();
		this.setEvents();

	}

	dashBoardHeader() {

		const cardHeader = document.createElement('div');
		cardHeader.setAttribute('class', 'card-header row dashBoardCard-header m-0 justify-content-between');

		const cardHeaderTitle = document.createElement('div');
		cardHeaderTitle.innerText = this.dashBoardInfo.name;

		cardHeader.appendChild(cardHeaderTitle);
		cardHeader.appendChild(this.dashBoardButtons());

		this.htmlComponent.appendChild(cardHeader);

		return cardHeaderTitle;

	}

	dashBoardButtons() {

		const cardButtons = document.createElement('div');

		this.playBtn = Components.buttonWithIcon('play', 'dashBoardCardOption');
		this.editBtn = Components.buttonWithIcon('pencil-square', 'dashBoardCardOption');
		this.delBtn = Components.buttonWithIcon('trash', 'dashBoardCardOption');

		cardButtons.appendChild(this.playBtn);
		cardButtons.appendChild(this.editBtn);
		cardButtons.appendChild(this.delBtn);

		return cardButtons;

	}

	dashBoardBody() {

		const cardBody = document.createElement('div');
		cardBody.className = 'card-body';

		const dashDesc = document.createElement('p');
		dashDesc.textContent = this.dashBoardInfo.desc;

		const dashPath = document.createElement('cite');
		dashPath.textContent = 'PATH:' + this.dashBoardInfo.path;

		cardBody.appendChild(dashDesc);
		cardBody.appendChild(dashPath);

		this.htmlComponent.appendChild(cardBody);

		return dashDesc;

	}

	setEvents() {

		this.playBtn.addEventListener('click', () => {

			this.EventHandler.dispatchEvent('OpenDashBoard', {
				context: 'editing',
				dashBoardPath: this.dashBoardInfo.path,
			});

		});

		this.editBtn.addEventListener('click', () => {

			console.log('contexto global alterado para edição');
			if (!this.title.isContentEditable) {

				this.editBtn.innerHTML = Components.icon('save');
				this.title.classList.add('editableDiv');
				this.desc.classList.add('editableDiv');
				this.title.contentEditable = true;
				this.desc.contentEditable = true;

			} else {

				this.editBtn.innerHTML = Components.icon('pencil-square');
				this.title.classList.remove('editableDiv');
				this.desc.classList.remove('editableDiv');
				this.title.contentEditable = false;
				this.desc.contentEditable = false;

			}

		});

		this.delBtn.addEventListener('click', () => {

			this.EventHandler.dispatchEvent('DeleteDashboard', {
				dashBoardPath: this.dashBoardInfo.path,
			});

		});

	}

};