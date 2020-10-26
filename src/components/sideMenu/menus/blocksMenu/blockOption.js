module.exports = class Block {

	constructor(id, title) {

		this.htmlComponent = document.createElement('div');
		this.content = document.createElement('div');
		this.title = title;
		this.preConfigs;
		this.id = id;
		this.init();

	}

	getData() {

	}

	build() {

		this.htmlComponent.classList.add('col-4');
		this.htmlComponent.classList.add('blockPreviewContainer');

		this.content.classList.add('blockPreview');

		this.htmlComponent.appendChild(this.content);

		this.content.onclick = () => {

			window.dispatchEvent(new CustomEvent('AddNewBlock', {
				detail: this.preConfigs,
			}));

		};

	}

	init() {

		this.getData();
		this.build();

	}

};