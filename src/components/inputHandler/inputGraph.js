module.exports = class InputGraph {

	constructor() {

		this.nodes = [];
		this.nodesDictionary = {};
		this.hasInconsistency = false;

	}

	initGraph() {

		window.CurrentInputGroup.rawInputs.forEach((input) => {

			const newNode = new Node(input);
			this.nodes.push(newNode);
			this.nodesDictionary[input.uuid] = newNode;

		});

		window.CurrentInputGroup.inputs.forEach((input) => {

			const newNode = new Node(input);
			this.nodes.push(newNode);
			this.nodesDictionary[input.uuid] = newNode;

		});

		this.CheckAndCorrectInconsistencies();

	}

	CheckAndCorrectInconsistencies() {

		let graphInconsistency = false;

		this.nodes.forEach((node) => {

			node.nextInputs = [];

		});

		this.nodes.forEach((node) => {

			let nodeInconsistency = false;

			node.dependencies.forEach((dependenceUuid) => {

				if (!(this.nodesDictionary[dependenceUuid])) {

					graphInconsistency = true;
					nodeInconsistency = true;

				} else {

					this.nodesDictionary[dependenceUuid].nextInputs.push(node);

				}

			});

			node.input.hasInconsistency = nodeInconsistency;

		});

		this.hasInconsistency = graphInconsistency;

	}

	addNode(input) {

		const newNode = new Node(input);

		this.nodes.push(newNode);
		this.nodesDictionary[input.uuid] = newNode;

		newNode.dependencies.forEach((dependenceUuid) => {

			this.nodesDictionary[dependenceUuid].nextInputs.push(newNode);

		});

		this.CheckAndCorrectInconsistencies();

		if (!this.topologicalSort()) {

			this.removeNode(input.uuid);
			this.CheckAndCorrectInconsistencies();
			this.topologicalSort();
			return false;

		} else {

			return true;

		}

		
	}

	resetBusca() {

		this.nodes.forEach((node) => {

			node.visited = -1;

		});

	}

	resetLeves() {

		this.nodes.forEach((node) => {

			node.level = -1;

		});

	}

	removeNode(inputUuid) {

		const index = this.nodes.indexOf(this.nodesDictionary[inputUuid]);

		if (index > -1) {

			this.nodes.splice(index, 1);
			delete this.nodesDictionary[inputUuid];
			this.CheckAndCorrectInconsistencies();

		}

	}

	topologicalSort() {

		if (this.DepthFirstSearch()) {

			this.nodes.sort((node1, node2) => {

				return node1.level - node2.level;

			});

			return true;

		} else {

			return false;

		}

	}

	DepthFirstSearch() {

		this.resetBusca();
		this.resetLeves();

		for (let i = 0; i < this.nodes.length; i++) {

			if (this.nodes[i].dependencies.length === 0 || this.nodes[i].input.hasInconsistency) {

				this.resetBusca();

				try {

					this.DepthFirstSearchRecursion(this.nodes[i], 0);

				} catch (error) {

					return false;

				}

			}

		}

		for (let i = 0; i < this.nodes.length; i++) {

			if (this.nodes[i].level == -1) {

				return false;

			}

		}

		return true;

	}

	DepthFirstSearchRecursion(node, currentPos) {

		if (node.visited === 0) {

			throw new Error('Ciclo Encontrado');

		}

		node.visited = 0;
		if (node.level === -1 || node.level < currentPos) {

			node.level = currentPos;
			node.nextInputs.forEach((nextInput) => {

				this.DepthFirstSearchRecursion(nextInput, currentPos + 1);

			});

		}

		node.visited = 1;

	}

	solve() {

	}

};

class Node {

	constructor(input) {

		this.uuid = input.uuid;
		this.input = input;
		this.nextInputs = [];
		this.visited = -1;
		this.level = -1;
		this.dependencies = input.dependencies;

	}

};