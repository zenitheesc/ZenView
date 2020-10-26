module.exports = class Block {

	constructor(id) {

		this.id = id;

		this.width = 3;
		this.height = 4;
		this.editing = false;

		this.htmlComponent = document.createElement('div');
		this.htmlComponent.className = 'grid-stack-item';

		this.content = document.createElement('div');
		this.content.className = 'grid-stack-item-content';

		this.htmlComponent.appendChild(this.content);

		this.setEvents();

	}

	setEvents() {

		this.content.ondblclick = () =>{

			window.dispatchEvent(new CustomEvent('BlockWasSelected', {
				detail: this,
			}));

			if (!this.editing) {

				this.content.classList.add('editingBlock');
				this.editing = true;

			} else {

				this.content.classList.remove('editingBlock');
				this.editing = false;

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