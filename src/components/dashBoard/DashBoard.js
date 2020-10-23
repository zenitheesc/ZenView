const GridStack = require('gridstack/dist/gridstack.all');
module.exports = class DahsBoard {

	constructor() {

		this.gridStack;

	}

	build() {

		this.gridStack = GridStack.init({
			float: true,
			column: 12,
			animate: true,

		});

		this.gridStack.enable('.grid-stack-item-content', true);

		this.addNewWidget();
		this.addNewWidget();

	}

	addNewWidget() {

		const newBlock = {};
		newBlock.height = (newBlock.height === undefined) ? 3 : newBlock.height;
		newBlock.width = (newBlock.width === undefined) ? 4 : newBlock.width;

		const div = document.createElement('div');
		div.className = 'grid-stack-item';
		this.gridStack.addWidget('<div><div class="grid-stack-item-content"><br></div></div>', newBlock);

	}

};