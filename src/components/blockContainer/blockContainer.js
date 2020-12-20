const Blocks       = require('../blocks/Blocks');
const BlockMenu    = require('./blockMenu');
const EventHandler = require('../eventHandler/eventHandler');
module.exports = class BlockContainer {

	constructor(preConfig) {

		this.EventHandler = new EventHandler();
		this.preConfig = preConfig;
		this.width = 3;
		this.height = 2;
		this.editing = false;

		this.htmlComponent = document.createElement('div');

		this.setEvents();

	}

	init() {

		this.block = new Blocks[this.preConfig.type](this.preConfig);
		this.content = this.block.htmlComponent;
		this.htmlComponent.appendChild(this.content);
		this.block.init();

	}

	updateBlockConfig(newConfig) {

		console.log(newConfig, this.block);

		if (newConfig.type === this.block.type) {

			this.block.updateConfig(newConfig);

		} else {

			try {

				this.preConfig = newConfig;
				this.block = new Blocks[this.preConfig.type](this.preConfig);
				console.log(this.block);
				this.htmlComponent.innerHTML = '';

				this.content = this.block.htmlComponent;
				this.htmlComponent.appendChild(this.content);
				this.block.init();

			} catch (error) {

				console.warn('TIPO DE BLOCO AINDA NÃO IMPLEMENTADO: ' + newConfig.type, error);

			}


		}


	}

	editBlock() {

		if (!this.editing) {

			this.content.classList.add('editingBlock');
			this.editing = true;
			window.CurrentBlock = this;

			this.EventHandler.BlockWasSelected(this);

			this.EventHandler.OpenSideMenu({
				requested: 'edit',
			});

			this.EventHandler.OpenMenu({
				name: 'edit',
			});

			this.EventHandler.SetSelectionEffect({
				name: 'edit',
			});

		} else {

			window.CurrentBlock = undefined;
			this.content.classList.remove('editingBlock');
			this.editing = false;

			this.EventHandler.OpenMenu({
				name: 'edit',
			});

		}

	}

	setEvents() {

		this.htmlComponent.ondblclick = () => {

			this.editBlock();

		};

		this.htmlComponent.addEventListener('contextmenu', (evt) => {

			const blockMenu = new BlockMenu(this.htmlComponent);

			evt.preventDefault();
			blockMenu.menuPopUp();

		});

		this.EventHandler.addEventListener('BlockWasSelected', (evt) => {

			if (evt !== this) {

				this.content.classList.remove('editingBlock');
				this.editing = false;

			}

		});

	}

};