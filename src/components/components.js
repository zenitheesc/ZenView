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
	static errorWarning(txt, id) {
		let errorMsg = document.createElement('div');
		errorMsg.className = 'invalid-feedback';
		errorMsg.textContent = txt;
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
};