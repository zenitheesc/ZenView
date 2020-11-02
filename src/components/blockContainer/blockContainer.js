const Blocks = require('../blocks/Blocks');
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

		this.block = new Blocks['Plotly'](this.preConfig);
		this.content = this.block.htmlComponent;
		this.htmlComponent.appendChild(this.content);
		this.block.init();

	}

	updateBlockConfig(newConfig) {


		this.block.updateConfig(newConfig);

	}

	setEvents() {

		this.htmlComponent.ondblclick = () => {


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


		};

		this.EventHandler.BlockWasSelected((evt) => {

			if (evt !== this) {

				this.content.classList.remove('editingBlock');
				this.editing = false;

			}

		});

	}

};