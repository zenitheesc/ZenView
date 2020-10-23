const Menu = require('../menu');

module.exports = class StartRead extends Menu {

	constructor() {

		super('Configurações', 'configs_menu');

		this.isReading = false;

	}

};