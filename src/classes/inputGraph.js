class Node {

	constructor(input) {

		this.name = input.name;
		this.input = input;
		this.nextInputs = [];
		this.visited = -1;
		this.dependencies = input.dependencies;

	}

}
module.exports = class InputGraph {

	constructor() {

		this.nodes = [];
		this.inputs = [];
		this.nodesDictionary = {};

	}
	/**
	 *  @param {Input} input
	 */
	addInput(input) {

		const newNode = new Node(input);
		this.nodes.push(newNode);
		this.inputs.push(input);
		this.nodesDictionary[input.name] = newNode;
		newNode.visited = -1;

	}

	resetBusca() {

		this.nodes.forEach((node) => {

			node.visited = -1;

		});

	}

	removeInput(input) {

	}
	/**
	 *
	 *
	 * @param {Node} node
	 * @param {Integer} currentPos
	 * @return {boolean}
	 */
	recursion(node, currentPos) {

		if (node.visited === 0) {

			throw new Error('Ciclo Encontrado');

		}

		node.visited = 0;
		if (node.level === undefined || node.level < currentPos) {

			node.level = currentPos;
			node.nextInputs.forEach((nextInput) => {

				this.recursion(nextInput, currentPos + 1);

			});

		}

		node.visited = 1;
		return true;

	}

	/**
	 *
	 */

	addEgdes() {

		this.nodes.forEach((node) => {

			node.nextInputs = [];
			node.level = undefined;

		});

		this.nodes.forEach((node) => {

			node.dependencies.forEach((dependenceName) => {

				this.nodesDictionary[dependenceName].nextInputs.push(node);

			});

		});

	}

	hasCycle() {

		this.nodes.forEach(
			(node) => {

				if (node.dependencies.length === 0) {

					this.resetBusca();
					try {

						if (!this.recursion(node, 0)) {

							return true;

						}

					} catch (error) {

						console.log(error);

					}

				}

			});

	}

	topologicalSort() {

		this.inputs.sort((input1, input2) => {

			return this.nodesDictionary[input1.name].level - this.nodesDictionary[input2.name].level;

		});

	}


};