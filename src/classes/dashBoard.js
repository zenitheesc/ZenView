module.exports = class DashBoard{
	constructor(name,nbmrInputs,path,description){
		this.name = name;
		this.nbmrInputs = nbmrInputs;
		this.inputs = {};
		this.blocks = {};
		this.path = path;
		this.description = description;
	}
};