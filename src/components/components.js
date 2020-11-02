const fs = require('fs');
const EventHandler = require('./eventHandler/eventHandler');

module.exports = class Components {

	static spliter(id, text, content, startOpen) {

		const card = document.createElement('div');
		card.className = 'card menuSpliter';

		const cardHeader = document.createElement('div');

		cardHeader.id = id + '_header';
		cardHeader.setAttribute('data-toggle', 'collapse');
		cardHeader.setAttribute('data-target', `#menu_${id}_option`);
		cardHeader.setAttribute('aria-expanded', startOpen);
		cardHeader.setAttribute('aria-controls', `menu_${id}_option`);
		cardHeader.textContent = text;

		const cardBodyCollapse = document.createElement('div');
		cardBodyCollapse.id = `menu_${id}_option`;

		if (startOpen) {

			cardBodyCollapse.className = 'collapse show';
			cardHeader.className = 'card-header menuSpliter-header';

		} else {

			cardHeader.className = 'card-header menuSpliter-header collapsed';
			cardBodyCollapse.className = 'collapse';

		}

		cardBodyCollapse.setAttribute('aria-labelledby', `${id}_option`);

		const cardBody = document.createElement('div');
		cardBody.className = 'card-body form-group';
		cardBody.appendChild(content);
		cardBodyCollapse.appendChild(cardBody);
		cardBody.id = id + '_body';
		card.appendChild(cardHeader);
		card.appendChild(cardBodyCollapse);

		return card;

	}
	static menuHeader(text, optionsContent) {

		const menuHeaderComponent = document.createElement('div');
		const title = document.createElement('h6');
		title.textContent = text;
		menuHeaderComponent.className = 'menuHeader';

		menuHeaderComponent.appendChild(title);

		if (optionsContent != undefined) {

			const options = document.createElement('div');
			options.appendChild(optionsContent);
			menuHeaderComponent.appendChild(options);

		}

		return menuHeaderComponent;

	}
	static icon(iconName) {

		return (fs.readFileSync('./src/images/icons/' + iconName + '.svg')).toString();

	}
	static dashBoardCard(name, desc, path) {

		const dashBoardCardComponent = document.createElement('div');
		dashBoardCardComponent.setAttribute('class', 'card dashBoardCard mb-3');
		dashBoardCardComponent.EventHandler = new EventHandler();
		const dashBoardCardComponentHeader = document.createElement('div');
		dashBoardCardComponentHeader.setAttribute('class', 'card-header row dashBoardCard-header m-0 justify-content-between');

		const dashBoardCardComponentHeaderTitle = document.createElement('div');
		dashBoardCardComponentHeaderTitle.innerText = name;

		const dashBoardCardComponentHeaderOptions = document.createElement('div');

		dashBoardCardComponentHeader.appendChild(dashBoardCardComponentHeaderTitle);


		const playBtn = this.buttonWithIcon('play', 'dashBoardCardOption');
		const editBtn = this.buttonWithIcon('pencil-square', 'dashBoardCardOption');
		const delBtn = this.buttonWithIcon('trash', 'dashBoardCardOption');

		dashBoardCardComponentHeaderOptions.appendChild(playBtn);
		dashBoardCardComponentHeaderOptions.appendChild(editBtn);
		dashBoardCardComponentHeaderOptions.appendChild(delBtn);

		dashBoardCardComponentHeader.appendChild(dashBoardCardComponentHeaderOptions);

		const dashBoardCardComponentBody = document.createElement('div');
		dashBoardCardComponentBody.className = 'card-body';

		const dashBoardCardComponentDesc = document.createElement('p');
		dashBoardCardComponentDesc.textContent = desc;

		const dashBoardCardComponentPath = document.createElement('cite');
		dashBoardCardComponentPath.textContent = 'PATH:' + path;

		dashBoardCardComponentBody.appendChild(dashBoardCardComponentDesc);
		dashBoardCardComponentBody.appendChild(dashBoardCardComponentPath);

		dashBoardCardComponent.appendChild(dashBoardCardComponentHeader);
		dashBoardCardComponent.appendChild(dashBoardCardComponentBody);

		playBtn.addEventListener('click', () => {

			dashBoardCardComponent.EventHandler.dispatchEvent('OpenDashBoard', {
				context: 'editing',
				dashBoardPath: path,
			});

		});

		editBtn.addEventListener('click', () => {

			console.log('contexto global alterado para edição');
			if (!dashBoardCardComponentHeaderTitle.isContentEditable) {

				editBtn.innerHTML = this.icon('save');
				dashBoardCardComponentHeaderTitle.classList.add('editableDiv');
				dashBoardCardComponentDesc.classList.add('editableDiv');
				dashBoardCardComponentHeaderTitle.contentEditable = true;
				dashBoardCardComponentDesc.contentEditable = true;

			} else {

				editBtn.innerHTML = this.icon('pencil-square');
				dashBoardCardComponentHeaderTitle.classList.remove('editableDiv');
				dashBoardCardComponentDesc.classList.remove('editableDiv');
				dashBoardCardComponentHeaderTitle.contentEditable = false;
				dashBoardCardComponentDesc.contentEditable = false;

			}

		});

		delBtn.addEventListener('click', () => {

			dashBoardCardComponent.EventHandler.dispatchEvent('DeleteDashboard', {
				detail: {
					dashBoardPath: path,
				},
			});

		});


		return dashBoardCardComponent;

	}
	static buttonWithIcon(iconName, className) {

		const button = document.createElement('button');
		button.type = 'button';
		if (className !== undefined) button.classList.add(className);
		button.innerHTML = this.icon(iconName);
		return button;

	}

};