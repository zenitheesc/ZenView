const Menu = require('../menu');

module.exports = class StartRead extends Menu {

	constructor() {

		super('Blocos disponíveis', 'blocks_menu');

		this.isReading = false;

	}

};