const Components = require('../../../components.js');
const Block = require('./blockOption');

module.exports = class Section {

	constructor(id, title) {

		this.htmlComponent = document.createElement('div');
		this.blocks = document.createElement('div');
		this.title = title;
		this.id = id;
		this.init();

	}

	sectionSplitter() {

		const spliter = Components.spliter(this.id, this.title, this.blocks, true);

		this.htmlComponent.appendChild(spliter);

	}
	/**
	 *
	 *
	 * @param {Block} block
	 */
	appendBlock(block) {

		this.blocks.appendChild(block.htmlComponent);

	}

	loadBlocks() {

		this.blocks.classList.add('row');

		this.appendBlock(new Block('newBlankOption', 'Novo bloco'));
		this.appendBlock(new Block('newBlankOption', 'Novo bloco'));
		this.appendBlock(new Block('newBlankOption', 'Novo bloco'));
		this.appendBlock(new Block('newBlankOption', 'Novo bloco'));
		this.appendBlock(new Block('newBlankOption', 'Novo bloco'));


	}

	init() {

		this.loadBlocks();
		this.sectionSplitter();

	}

};