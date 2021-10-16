const Blocks = require('../blocks/Blocks');
const BlockMenu = require('./blockMenu');
const EventHandler = require('../eventHandler/eventHandler');
const Components = require('../components');

module.exports = class BlockContainer {

	constructor(preConfig, title = '') {

		this.eventHandler = new EventHandler();

		this.preConfig = preConfig;
		this.width = 3;
		this.height = 2;
		this.editing = false;
		this.build();

		this.title = title;
		this.trash.style.display = 'none';

		this.setEvents();

	}

	get title() {
		return this.headerTitle.innerText;
	}

	set title(newTitle) {
		this.headerTitle.innerText = newTitle;
	}

	get formConfig() {
		return {
			blockTitle: this.title,
			type: this.block.type,
			blockConfig: this.block.formConfig,

		}
	}

	buildHeader() {

		this.header = document.createElement('div');

		this.buttonsContainer = document.createElement('div');
		this.buttonsContainer.className = "buttonsContainer";

		this.trash = Components.buttonWithIcon('trash-alt-regular', 'blockButton');
		this.edit = Components.buttonWithIcon('pencil-square', 'blockButton');

		this.buttonsContainer.appendChild(this.trash);
		this.buttonsContainer.appendChild(this.edit);
		this.header.appendChild(this.buttonsContainer);

		this.headerTitle = document.createElement('div')
		this.headerTitle.className = "blockTitle";
		this.headerTitle.innerText = '';

		this.header.appendChild(this.headerTitle);

		this.header.classList.add('blockHeader');

		return this.header;

	}

	buildBody() {

		const body = document.createElement('div');

		body.classList.add('grid-stack-item-content');

		return body;

	}

	build() {

		this.htmlComponent = document.createElement('div');
		this.htmlComponent.classList.add('grid-stack-item');
		this.content = document.createElement('div');
		this.content.style.flex = '1';

		this.body = this.buildBody();
		this.header = this.buildHeader();

		this.body.appendChild(this.header);
		this.body.appendChild(this.content);

		this.htmlComponent.appendChild(this.body);

	}

	init() {

		this.block = new Blocks[this.preConfig.type](this.preConfig, this.content);
		this.block.init();

	}

	load(blockConfig) {
		this.block = new Blocks[this.preConfig.type](this.preConfig, this.content);
		this.block.load(blockConfig);
	}

	updateBlockConfig(newConfig) {

		this.eventHandler.dispatchEvent('DashboardNotSaved');
		this.block.updateConfig(newConfig.blockConfig[newConfig.type]);

	}

	updateModule(newConfig) {

		if (newConfig.type !== this.block.type) {

			this.preConfig = newConfig;
			this.content.innerHTML = ''

			try {

				this.block = new Blocks[this.preConfig.type](this.preConfig, this.content);
				this.block.init();

			} catch (error) {

				console.warn('TIPO DE BLOCO AINDA NÃO IMPLEMENTADO: ' + newConfig.type, error);

			}

		}

	}

	uptadeBlockGeneralConfig(newConfig) {

		this.eventHandler.dispatchEvent('DashboardNotSaved');

		this.title = newConfig.blockTitle;
		this.updateModule(newConfig);

	}

	sendBlockInstruction(newInstruction) {

		this.eventHandler.dispatchEvent('DashboardNotSaved');
		return this.block.instructionHandler(newInstruction);

	}

	editBlock() {

		if (!this.editing) {

			this.body.classList.add('editingBlock');
			this.editing = true;
			window.CurrentBlock = this;

			this.eventHandler.BlockWasSelected(this);

			this.eventHandler.OpenSideMenu({
				requested: 'edit',
			});

			this.eventHandler.OpenMenu({
				name: 'edit',
			});

			this.eventHandler.SetSelectionEffect({
				name: 'edit',
			});

		} else {

			window.CurrentBlock = undefined;
			this.body.classList.remove('editingBlock');
			this.editing = false;

			this.eventHandler.OpenMenu({
				name: 'edit',
			});

		}

	}

	blockLog() {

		return {
			preConfig: this.preConfig,
			blockConfig: this.block.save(),
			title: this.title,
			x: this.htmlComponent.dataset.gsX,
			y: this.htmlComponent.dataset.gsY,
			w: this.htmlComponent.dataset.gsWidth,
			h: this.htmlComponent.dataset.gsHeight,
		};

	}

	setEvents() {

		this.header.ondblclick = () => {

			this.editBlock();

		};

		this.htmlComponent.addEventListener('contextmenu', (evt) => {

			const blockMenu = new BlockMenu(this);

			evt.preventDefault();
			blockMenu.menuPopUp();

		});

		this.trash.addEventListener('click', (evt) => {

			this.eventHandler.dispatchEvent('RemoveBlock', this);
			this.block.destroy();

		});

		this.edit.addEventListener('click', (evt) => {

			this.editBlock();

		});

		this.eventHandler.addEventListener('BlockWasSelected', (evt) => {

			if (evt !== this) {

				this.body.classList.remove('editingBlock');
				this.editing = false;

			}

		});

		this.eventHandler.addEventListener('DataIsProcessed', (evt) => {

			this.block.updateData(evt);

		});

		this.eventHandler.addEventListener('StartRead', (evt) => {

			this.block.willRead();

		});

	}

};
