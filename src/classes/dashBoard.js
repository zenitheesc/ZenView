const InputGroup = require('./InputGroup');
module.exports = class DashBoard{
	constructor(name,nbmrInputs,path,description){
		this.name;
		this.inputs =[];
		this.blocks;
		this.path;
		this._associationInput = {};
		this.description;
		if(arguments.length === 1){
			this.constructFromJson();
		}else{
			this.newConstructor(name,nbmrInputs,path,description);
		}
	}
	getInput(inputName){
		return this._associationInput[inputName];
	}
	newConstructor(name,nbmrInputs,path,description){
		this.name = name;
		this.blocks = {};
		this.path = path;
		this.description = description;
		this.inputs = new InputGroup(nbmrInputs);
	}
	constructFromJson(dashBoardJson){
		this.name = dashBoardJson;
		this.inputs = dashBoardJson;
		this.blocks = dashBoardJson;
		this.path = dashBoardJson;
		this.description = dashBoardJson;
	}
};