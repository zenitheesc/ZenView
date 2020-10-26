module.exports = class Block {

	constructor(id) {

		this.id = id;

		this.width = 3;
		this.height = 4;

		this.htmlComponent = document.createElement('div');
		this.htmlComponent.className = 'grid-stack-item';

		this.content = document.createElement('div');
		this.content.className = 'grid-stack-item-content';

		this.htmlComponent.appendChild(this.content);

		this.setEvents();

	}

	setEvents() {

	}

};