const InputGroup = require('./inputGroup');
module.exports = class DashBoard {

	constructor(name, nbmrInputs, path, description) {

		this.name;
		this.inputGroup;
		this.blocks;
		this.path;
		this.description;
		if (arguments.length === 1) {

			this.constructFromJson(name);

		} else {

			this.newConstructor(name, nbmrInputs, path, description);

		}

	}
	newConstructor(name, nbmrInputs, path, description) {

		this.name = name;
		this.blocks = [];
		this.path = path;
		this.description = description;
		this.inputGroup = new InputGroup(nbmrInputs);

	}
	constructFromJson(dashBoardJson) {

		this.name = dashBoardJson.name;
		this.blocks = dashBoardJson.blocks;
		this.path = dashBoardJson.path;
		this.description = dashBoardJson.description;
		this.inputGroup = new InputGroup(dashBoardJson.inputGroup, true);

	}

};