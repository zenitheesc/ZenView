const Math = require('mathjs');
const {v4: uuidv4} = require('uuid');

module.exports = class Input {

	constructor(name, expression, scope, uuid) {

		this.name = name;
		this.uuid = uuid ?? ('id'+uuidv4().replaceAll('-', ''));
		this.dependencies = [];
		this.hasInconsistency = false;
		this.expression = {
			raw: expression.raw || expression.formatted,
			formatted: expression.formatted,
			readble: expression.readble,
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

		this.scope[this.uuid] = this.compiledExpression.evaluate(this.scope);

	}

};