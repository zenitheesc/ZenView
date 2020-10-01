const Math = require('mathjs');

module.exports = class Input {

	constructor(name, expression, scope) {

		this.name = name;
		this.expression = expression;
		this.scope = scope;
		this.scope[name] = this.getValue;

	}

	/**
	 * @param {String} newExpression
	 */
	set expression(newExpression) {
		console.log(newExpression);
		this.dependencies = [];

		this._expression = newExpression.formated;
		this.rawExpression = newExpression.raw;

		this.compiledExpression = Math.compile(this._expression);

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