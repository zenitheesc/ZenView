const EventHandler = require('../../../eventHandler/eventHandler');

module.exports = class Block {

	constructor(title, config) {

		this.EventHandler = new EventHandler();
		this.htmlComponent = document.createElement('div');
		this.content = document.createElement('div');
		this.title = title;
		this.preConfigs = config;
		this.init();

	}

	build() {

		this.htmlComponent.classList.add('col-4');
		this.htmlComponent.classList.add('blockPreviewContainer');

		this.content.classList.add('blockPreview');

		this.htmlComponent.appendChild(this.content);

		this.content.onclick = () => {

			this.EventHandler.AddNewBlock(this.preConfigs);

		};

	}

	init() {

		this.build();

	}

};