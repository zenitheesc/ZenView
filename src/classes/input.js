const Math = require('mathjs');
module.exports = class Input {

	constructor(name, expression, scope) {

		this.name = name;
		this.dependencies = [];
		this.hasInconsistency = false;
		this.expression = {
			raw: expression.raw || expression.formatted,
			formatted: expression.formatted,
		};

		this.compiledExpression = Math.compile(this.expression.formatted);

		this.scope = scope;

		this.setDependencies();

	}

	reset() {

		this.dependencies = [];
		this.compiledExpression = Math.compile(this.expression.formatted);
		this.setDependencies();

	}


	setDependencies() {

		Math.parse(this.expression.formatted).filter((node) => {

			return node.isSymbolNode;

		}).forEach((node) => {

			if (node.name !== this.name) {

				this.dependencies.push(node.name);

			}

		});

	}

	evaluate() {

		this.scope[this.name] = this.compiledExpression.evaluate(this.scope);

	}

};