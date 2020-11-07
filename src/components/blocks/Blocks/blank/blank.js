const Block = require('../block');

module.exports = class Blank extends Block {

	constructor(preConfig) {

		super();
		this.id = 'Blank';
		this.formConfig = {};
		this.type = 'Blank';

	}

}