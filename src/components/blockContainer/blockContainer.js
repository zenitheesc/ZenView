const Blocks = require('../blocks/Blocks');
const Block = require('../blocks/Blocks/block');
module.exports = class BlockContainer {

	constructor(id) {

		this.id = id;

		this.width = 3;
		this.height = 2;
		this.editing = false;
		this.block = new Block();

		this.htmlComponent = document.createElement('div');
		this.htmlComponent.className = 'grid-stack-item';

		this.content = document.createElement('div');
		this.content.className = 'grid-stack-item-content';

		this.htmlComponent.appendChild(this.content);

		this.setEvents();

	}

	setBlock(BlockConfig) {

		this.block = Blocks[BlockConfig.BlockID];
		this.block.init();

	}

	setEvents() {

		this.content.ondblclick = () =>{


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