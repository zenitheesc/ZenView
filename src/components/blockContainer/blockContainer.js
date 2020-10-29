const Blocks = require('../blocks/Blocks');
module.exports = class BlockContainer {

	constructor(id) {

		this.id = id;

		this.width = 3;
		this.height = 2;
		this.editing = false;

		this.htmlComponent = document.createElement('div');

		this.setEvents();


	}

	init(blockConfig) {

		this.block = new Blocks['PlotlyScatter']();
		this.content = this.block.htmlComponent;
		this.htmlComponent.appendChild(this.content);
		this.block.init();
		this.setEvents();

	}

	setEvents() {

		this.htmlComponent.ondblclick = () => {


			if (!this.editing) {

				this.content.classList.add('editingBlock');
				this.editing = true;
				window.CurrentBlock = this;

				window.dispatchEvent(new CustomEvent('BlockWasSelected', {
					detail: this,
				}));

				window.dispatchEvent(new CustomEvent('openSideMenu', {
					detail: {
						requested: 'edit',
					},
				}));

				window.dispatchEvent(new CustomEvent('openMenu', {
					detail: {
						name: 'edit',
					},
				}));

				window.dispatchEvent(new CustomEvent('setSelectionEffect', {
					detail: {
						name: 'edit',
					},
				}));

			} else {

				window.CurrentBlock = undefined;
				this.content.classList.remove('editingBlock');
				this.editing = false;

				window.dispatchEvent(new CustomEvent('openMenu', {
					detail: {
						name: 'edit',
					},
				}));

			}


		};

		window.addEventListener('BlockWasSelected', (evt) => {

			if (evt.detail !== this) {

				this.content.classList.remove('editingBlock');
				this.editing = false;

			}

		});

	}

};