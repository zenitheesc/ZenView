const Math = require('mathjs');

module.exports = class Input{
	constructor(name,expression,scope){
		this.name = name;
		this.expression = expression.formated || expression;
		this.scope = scope;
		this.rawExpression = expression.raw || this.expression;
		this.compiledExpression = Math.compile(this.expression);
		this.dependencies = Math.parse(this.expression).filter((node)=>{
			return node.isSymbolNode;
		});

		this.scope[name] = this.getValue;
	}
	getValue(){
		return this.compiledExpression.evaluate(this.scope);
	}
};