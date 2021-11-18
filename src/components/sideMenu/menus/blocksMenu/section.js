const Components = require('../../../components.js');
const Block = require('./blockOption');
const fs = require('fs');
module.exports = class Section {

	constructor(id, title) {

		this.htmlComponent = document.createElement('div');
		this.blocks = document.createElement('div');
		this.title = title;
		this.id = id;
		this.init();

	}

	sectionSplitter() {

		const splitter = Components.splitter(this.id, this.title, this.blocks, true);

		this.htmlComponent.appendChild(splitter);

	}
	/**
	 *
	 *
	 * @param {Block} block
	 */
	appendBlock(block) {

		this.blocks.appendChild(block.htmlComponent);

	}

	loadData() {

		return JSON.parse(fs.readFileSync('./assets/blocksConfig/' + this.id + '.json'));

	}

	loadBlocks() {

		const blocksData = this.loadData(this.id);
		this.blocks.classList.add('row');

		blocksData.forEach((blockData) => {

			this.appendBlock(new Block(blockData.title, blockData));

		});

	}

	init() {

		this.loadBlocks();
		this.sectionSplitter();

	}

};