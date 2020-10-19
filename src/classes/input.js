module.exports = class Input {

	constructor(name, expression, scope, customMathModule) {

		this.Math = customMathModule;

		this.name = name;
		this.dependencies = [];
		
		this.expression = {
			raw: expression.raw || expression.formatted,
			formatted: expression.formatted
		}

		this.compiledExpression = this.Math.compile(this.expression.formatted);

		this.scope = scope;

		this.setDependencies();
	}

	setDependencies() {

		this.Math.parse(this.expression.formatted).filter((node) => {

			return node.isSymbolNode;

		}).forEach((node) => {

			if (node.name !== 'r$') {

				this.dependencies.push(node.name);

			}

		});

	}

	evaluate() {

		this.scope[this.name] = this.compiledExpression.evaluate(this.scope);

	}

};