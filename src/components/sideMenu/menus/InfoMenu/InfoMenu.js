const Menu = require('../menu');

module.exports = class StartRead extends Menu {

	constructor() {

		super('Informações', 'about_menu');

		this.isReading = false;

	}

};