module.exports = class DashBoard{
	constructor(name,nbmrInputs,path,description){
		this.name;
		this.nbmrInputs;
		this.inputs;
		this.blocks;
		this.path;
		this.description;
		if(arguments.length === 1){
			this.constructFromJson();
		}else{
			this.newConstructor(name,nbmrInputs,path,description);
		}
	}
	newConstructor(name,nbmrInputs,path,description){
		this.name = name;
		this.nbmrInputs = nbmrInputs;
		this.inputs = {};
		this.blocks = {};
		this.path = path;
		this.description = description;
	}
	constructFromJson(dashBoardJson){
		this.name = dashBoardJson;
		this.nbmrInputs = dashBoardJson;
		this.inputs = dashBoardJson;
		this.blocks = dashBoardJson;
		this.path = dashBoardJson;
		this.description = dashBoardJson;
	}
};