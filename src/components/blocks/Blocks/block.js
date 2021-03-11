module.exports = class Block {

	constructor(preConfig, htmlComponent) {

		this.htmlComponent = htmlComponent;
		this.preConfig = preConfig;
		this.inputDependencies = [];

	}

	init() {

	}

	setAutoResize() {

	}

	updateConfig() {

	}

	instructionHandler(instruction) {
		this[instruction.command](instruction.data);
	}

	updateData() {

	}

	addDependencie(dependenciesName) {

		if (Array.isArray(dependenciesName)) {

			dependenciesName.forEach((dependencieName) => {

				this.inputDependencies.push(dependencieName);

			});

		} else {

			this.inputDependencies.push(dependencieName);

		}

	}

	rmvDependencie(dependenciesName) {

		if (Array.isArray(dependenciesName)) {

			dependenciesName.forEach((dependencieName) => {

				const index = this.inputDependencies.indexOf(dependencieName);

				if (index > -1) {

					array.splice(index, 1);

				}

			});

		} else {

			const index = this.inputDependencies.indexOf(dependenciesName);

			if (index > -1) {

				array.splice(index, 1);

			}

		}

	}

};