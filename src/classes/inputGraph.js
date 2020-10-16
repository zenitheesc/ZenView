module.exports = class InputGraph {
	constructor() {
		this.nodes = [];
		this.nodesDictionary = {};
	}
	/**
	 *  @param {Input} input
	 */
	addInput(input) {
		this.nodes.push(input);
		this.nodesDictionary[input.name] = input;
		input.visited = -1;
	}

	resetBusca() {
		this.nodes.forEach((input) => {
			input.visited = -1;
		})
	}

	removeInput(input) {

	}
	/**
	 *  @param {Input} input
	 */
	recursion(input, currentPos) {
		if (input.visited === 0) {
			throw new Error('Ciclo Encontrado');
		}
		
		input.visited = 0
		if (input.level === undefined || input.level < currentPos) {
			input.level = currentPos;
			console.log('testando2: ',input)
			input.nextInputs.forEach((nextInput) => {
				this.recursion(nextInput, currentPos + 1);
			})
		}

		input.visited = 1;
		return true;
	}

	/**
	 *  @param {Input} input
	 */

	addEgdes() {

		this.nodes.forEach(input => {
			input.nextInputs = [];
			input.level = undefined;
		})

		this.nodes.forEach(input => {
			input.dependencies.forEach((dependenceName) => {
				this.nodesDictionary[dependenceName].nextInputs.push(input);
			})
		})
	}

	hasCycle() {

		this.nodes.forEach(
			(input) => {
				if (input.dependencies.length === 0) {
					console.log('testando: '+ input.name)
					this.resetBusca();
					try {
						if (!this.recursion(input, 0)) {
							return true;
						}
					} catch (error) {
						console.log(error);
					}
				}
			})

	}

	topologicalSort() {
		this.nodes.sort((input1, input2) => {
			return input1.level - input2.level
		})
	}
}