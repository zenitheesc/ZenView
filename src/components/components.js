const fs = require('fs');
module.exports = class Components {
	static spliter(id, text, content, startOpen) {
		let card = document.createElement('div');
		card.className = 'card menuSpliter';

		let cardHeader = document.createElement('div');

		cardHeader.id = id + '_header';
		cardHeader.setAttribute('data-toggle', 'collapse');
		cardHeader.setAttribute('data-target', `#menu_${id}_option`);
		cardHeader.setAttribute('aria-expanded', startOpen);
		cardHeader.setAttribute('aria-controls', `menu_${id}_option`);
		cardHeader.textContent = text;

		let cardBodyCollapse = document.createElement('div');
		cardBodyCollapse.id = `menu_${id}_option`;

		if (startOpen) {
			cardBodyCollapse.className = 'collapse show';
			cardHeader.className = 'card-header menuSpliter-header';
		} else {
			cardHeader.className = 'card-header menuSpliter-header collapsed';
			cardBodyCollapse.className = 'collapse';
		}

		cardBodyCollapse.setAttribute('aria-labelledby', `${id}_option`);

		let cardBody = document.createElement('div');
		cardBody.className = 'card-body form-group';
		cardBody.appendChild(content);
		cardBodyCollapse.appendChild(cardBody);
		cardBody.id = id + '_body';
		card.appendChild(cardHeader);
		card.appendChild(cardBodyCollapse);

		return card;
	}
	static menuHeader(text, optionsContent) {
		let menuHeaderComponent = document.createElement('div');
		let title = document.createElement('h6');
		title.textContent = text;
		menuHeaderComponent.className = 'menuHeader';

		menuHeaderComponent.appendChild(title);

		if (optionsContent != undefined) {
			let options = document.createElement('div');
			options.appendChild(optionsContent);
			menuHeaderComponent.appendChild(options);
		}

		return menuHeaderComponent;
	}
	static errorWarning(id) {
		let errorMsg = document.createElement('div');
		errorMsg.className = 'invalid-feedback';
		errorMsg.id = id + '_errorMsg';
		return errorMsg;
	}
	static textInput(text, id) {
		let textInputGroup = document.createElement('div');
		textInputGroup.className = 'input-group-sm mb-3';

		let label = document.createElement('small');
		label.className = 'form-text text-muted';
		label.textContent = text;
		textInputGroup.appendChild(label);

		let textInputComponent = document.createElement('input');
		textInputComponent.id = id;
		textInputComponent.type = 'text';
		textInputComponent.className = 'form-control';
		textInputComponent.setAttribute('aria-label', 'Small');
		textInputComponent.setAttribute('aria-describedby', 'inputGroup-sizing-sm');
		textInputGroup.appendChild(textInputComponent);
		textInputGroup.appendChild(this.errorWarning(id));

		return textInputGroup;
	}
	static numberInput(text, id, min, max) {
		let textInputGroup = document.createElement('div');
		textInputGroup.className = 'input-group-sm mb-3';

		let label = document.createElement('small');
		label.className = 'form-text text-muted';
		label.textContent = text;
		textInputGroup.appendChild(label);

		let textInputComponent = document.createElement('input');
		textInputComponent.id = id;
		textInputComponent.type = 'number';
		textInputComponent.max = max;
		textInputComponent.min = min;
		textInputComponent.className = 'form-control';
		textInputComponent.setAttribute('aria-label', 'Small');
		textInputComponent.setAttribute('aria-describedby', 'inputGroup-sizing-sm');
		textInputGroup.appendChild(textInputComponent);

		return textInputGroup;
	}
	static textArea(text, id) {
		let textInputGroup = document.createElement('div');
		textInputGroup.className = 'input-group-sm mb-3';

		let label = document.createElement('small');
		label.className = 'form-text text-muted';
		label.textContent = text;
		textInputGroup.appendChild(label);

		let textInputComponent = document.createElement('textarea');
		textInputComponent.id = id;
		textInputComponent.className = 'form-control';
		textInputComponent.setAttribute('aria-label', 'Small');
		textInputComponent.setAttribute('aria-describedby', 'inputGroup-sizing-sm');
		textInputGroup.appendChild(textInputComponent);

		return textInputGroup;
	}
	static icon(iconName) {
		return (fs.readFileSync('./src/images/icons/' + iconName + '.svg')).toString();
	}
	static dashBoardCard(name, desc, path) {
		let dashBoardCardComponent = document.createElement('div');
		dashBoardCardComponent.setAttribute('class', 'card dashBoardCard mb-3');

		let dashBoardCardComponentHeader = document.createElement('div');
		dashBoardCardComponentHeader.setAttribute('class', 'card-header row dashBoardCard-header m-0 justify-content-between');

		let dashBoardCardComponentHeaderTitle = document.createElement('div');
		dashBoardCardComponentHeaderTitle.innerText = name;

		let dashBoardCardComponentHeaderOptions = document.createElement('div');

		dashBoardCardComponentHeader.appendChild(dashBoardCardComponentHeaderTitle);


		let playBtn = document.createElement('button');
		let editBtn = document.createElement('button');
		let delBtn = document.createElement('button');

		playBtn.className = 'dashBoardCardOption';
		editBtn.className = 'dashBoardCardOption';
		delBtn.className = 'dashBoardCardOption';

		playBtn.innerHTML = this.icon('play');
		editBtn.innerHTML = this.icon('pencil-square');
		delBtn.innerHTML = this.icon('trash');

		dashBoardCardComponentHeaderOptions.appendChild(playBtn);
		dashBoardCardComponentHeaderOptions.appendChild(editBtn);
		dashBoardCardComponentHeaderOptions.appendChild(delBtn);

		dashBoardCardComponentHeader.appendChild(dashBoardCardComponentHeaderOptions);

		let dashBoardCardComponentBody = document.createElement('div');
		dashBoardCardComponentBody.className = 'card-body';

		let dashBoardCardComponentDesc = document.createElement('p');
		dashBoardCardComponentDesc.textContent = desc;

		let dashBoardCardComponentPath = document.createElement('cite');
		dashBoardCardComponentPath.textContent = 'PATH:' + path;

		dashBoardCardComponentBody.appendChild(dashBoardCardComponentDesc);
		dashBoardCardComponentBody.appendChild(dashBoardCardComponentPath);

		dashBoardCardComponent.appendChild(dashBoardCardComponentHeader);
		dashBoardCardComponent.appendChild(dashBoardCardComponentBody);

		return dashBoardCardComponent;
	}
};