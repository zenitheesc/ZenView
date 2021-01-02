const fs = require('fs');

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
	static buttonWithIcon(iconName, className) {

		const button = document.createElement('button');
		button.type = 'button';
		if (className !== undefined) button.classList = className;
		button.innerHTML = this.icon(iconName);
		return button;

	}

};