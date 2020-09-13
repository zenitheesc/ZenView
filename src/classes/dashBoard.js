const Input = require('./input');
module.exports = class DashBoard{
	constructor(name,nbmrInputs,path,description){
		this.name;
		this.nbmrInputs;
		this.inputs =[];
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
		this.blocks = {};
		this.path = path;
		this.description = description;
		this.generateInputs();
	}
	constructFromJson(dashBoardJson){
		this.name = dashBoardJson;
		this.nbmrInputs = dashBoardJson;
		this.inputs = dashBoardJson;
		this.blocks = dashBoardJson;
		this.path = dashBoardJson;
		this.description = dashBoardJson;
	}
	generateInputs(){
		for(let i=0;i<this.nbmrInputs;i++){
			this.inputs.push(new Input('NewInput'+i,'col'+i));
		}
	}
};