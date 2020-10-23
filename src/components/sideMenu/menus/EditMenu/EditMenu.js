const Menu = require('../menu');

module.exports = class StartRead extends Menu {

	constructor() {

		super('Edição', 'edit_menu');

		this.isReading = false;

	}

};