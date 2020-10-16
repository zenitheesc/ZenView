const Math = require('mathjs');

module.exports = class Input {

	constructor(name, expression, scope) {

		this.name = name;
		this.dependencies = [];
		this.expression = expression;
		this.scope = scope;

		
		this.nextInputs = [];

	}

	/**
	 * @param {String} newExpression
	 */
	set expression(newExpression) {

		this._expression = newExpression.formated || newExpression;
		this.rawExpression = newExpression.raw || newExpression;

		this.compiledExpression = Math.compile(this._expression);

		this.setDependencies();

	}

	setDependencies() {

		Math.parse(this._expression).filter((node) => {

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