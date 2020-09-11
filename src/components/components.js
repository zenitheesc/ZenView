const fs = require('fs');
const ipc = require('electron').ipcRenderer;
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
	static textInput(text, id, className) {
		let textInputGroup = document.createElement('div');

		textInputGroup.className = 'input-group-sm mb-3';
		textInputGroup.classList.add(className);

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
	static inputCard(id) {
		let inputCardComponent = document.createElement('div');
		let inputCardComponentRow1 = document.createElement('div');
		let inputCardComponentRow2 = document.createElement('div');
		inputCardComponent.className = 'inputCard mb-2';

		inputCardComponentRow1.className = 'form-row';
		inputCardComponentRow2.className = 'form-row';

		let saveBtn = document.createElement('button');
		let delBtn = document.createElement('button');

		saveBtn.className = 'inputCard';
		delBtn.className = 'inputCard';

		saveBtn.innerHTML = this.icon('save');
		delBtn.innerHTML = this.icon('trash');



		inputCardComponentRow1.appendChild(this.textInput('Nome', id + '_name', 'col-10'));
		inputCardComponentRow2.appendChild(this.textInput('Retorno', id + '_return', 'col-10'));

		inputCardComponentRow1.appendChild(saveBtn);
		inputCardComponentRow2.appendChild(delBtn);

		inputCardComponent.appendChild(inputCardComponentRow1);
		inputCardComponent.appendChild(inputCardComponentRow2);

		return inputCardComponent;
	}
	static pathInput(text,id,className) {
		let pathInputGroup = document.createElement('div');
		
		pathInputGroup.className = 'input-group mb-3 pathInput';
		pathInputGroup.classList.add(className);

		let label = document.createElement('small');
		label.className = 'form-text text-muted';
		label.textContent = text;
		pathInputGroup.appendChild(label);

		let inputConainer = document.createElement('div');
		inputConainer.className = 'input-group';
		let inputGroupPrepend = document.createElement('div');
		inputGroupPrepend.className = 'input-group-prepend';

		let inputGroupPrependButton = document.createElement('button');

		inputGroupPrependButton.innerHTML = this.icon('folder2-open');

		inputGroupPrepend.appendChild(inputGroupPrependButton);

		inputConainer.appendChild(inputGroupPrepend);

		let pathInputComponent = document.createElement('input');
		pathInputComponent.disabled = true;
		pathInputComponent.id = id;
		pathInputComponent.type = 'text';
		pathInputComponent.className = 'form-control';
		pathInputComponent.setAttribute('aria-describedby', 'basic-addon1');
		inputConainer.appendChild(pathInputComponent);
		inputConainer.appendChild(this.errorWarning(id));

		pathInputGroup.appendChild(inputConainer);
		
		inputConainer.onclick =  () => {
			ipc.send('open-file-dialog-for-dir');
		};
		ipc.on('selected-dir',(evt,arg)=>{
			if(arg !== '' && arg !== undefined){
				pathInputComponent.value = arg || '';
				pathInputComponent.textContent = arg || '';
			}
		});

		return pathInputGroup;
	}
};