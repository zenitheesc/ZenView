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
			this.nodesDictionary[input.name] = newNode;

		});

		window.CurrentInputGroup.inputs.forEach((input) => {

			const newNode = new Node(input);
			this.nodes.push(newNode);
			this.nodesDictionary[input.name] = newNode;

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

			node.dependencies.forEach((dependenceName) => {

				if (!(this.nodesDictionary[dependenceName])) {

					graphInconsistency = true;
					nodeInconsistency = true;

				} else {

					this.nodesDictionary[dependenceName].nextInputs.push(node);

				}

			});

			node.input.hasInconsistency = nodeInconsistency;

		});

		this.hasInconsistency = graphInconsistency;

		return this.topologicalSort();

	}

	addNode(input) {

		let maxLevel = -1;
		const newNode = new Node(input);

		this.nodes.push(newNode);
		this.nodesDictionary[input.name] = newNode;

		newNode.dependencies.forEach((dependenceName) => {

			this.nodesDictionary[dependenceName].nextInputs.push(newNode);

			if (maxLevel < this.nodesDictionary[dependenceName].level) {

				maxLevel = this.nodesDictionary[dependenceName].level;

			}

		});

		newNode.level = maxLevel + 1;

	}

	resetBusca() {

		this.nodes.forEach((node) => {

			node.visited = -1;

		});

	}

	resetLeves() {

		this.nodes.forEach((node) => {

			node.level = 0;

		});

	}

	removeNode(inputName) {

		const index = this.nodes.indexOf(this.nodesDictionary[inputName]);

		if (index > -1) {

			this.nodes.splice(index, 1);
			delete this.nodesDictionary[inputName];

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

		this.nodes.forEach(
			(node) => {

				if (node.dependencies.length === 0) {

					this.resetLeves();

					try {

						if (!this.DepthFirstSearchRecursion(node, 0)) {

							return true;

						}

					} catch (error) {
						
						console.warn(error);
						return false;

					}

				}

			});
		
		return true;
		
	}

	editNode(inputData) {

		const input = this.nodes.indexOf(this.nodesDictionary[inputData.name]);

		this.removeNode(inputData.name);
		this.addNode(inputData.input);
		
		if (this.CheckAndCorrectInconsistencies()) {

			return true;

		} else {

			this.removeNode(inputData.newName);
			this.addNode(input);
			this.CheckAndCorrectInconsistencies();

			return false;

		}

	}

	DepthFirstSearchRecursion(node, currentPos) {

		if (node.visited === 0) {

			throw new Error('Ciclo Encontrado');

		}

		node.visited = 0;
		if (node.level === 0 || node.level < currentPos) {

			node.level = currentPos;
			node.nextInputs.forEach((nextInput) => {

				this.DepthFirstSearchRecursion(nextInput, currentPos + 1);

			});

		}

		node.visited = 1;
		return true;

	}

	solve() {

	}

};

class Node {

	constructor(input) {

		this.name = input.name;
		this.input = input;
		this.nextInputs = [];
		this.visited = -1;
		this.level = 0;
		this.dependencies = input.dependencies;

	}

};