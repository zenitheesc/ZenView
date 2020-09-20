const Math = require('mathjs');
module.exports = class Input{
	constructor(name,expression){
		this.name = name;
		this.expression = expression;
		this.dependencies;
		this.expressionTree;
	}
	setDependencies(){
		this.dependencies = this.expressionTree.filter((node)=>{
			return node.isSymbolNode;
		});
	}
	validateExpression(){
		try{
			this.expressionTree = Math.parse(this.expression);
			console.log('ok');
			return true;
		}catch(error){
			console.log('erro');
			return false;
		}
	}
};