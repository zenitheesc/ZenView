module.exports = class Block {

	constructor() {

		this.htmlComponent = document.createElement('div');
		this.htmlComponent.classList.add('h-100');
		this.inputDependencies = [];

	}

	init() {

	}

	setAutoResize() {

	}

	updateConfig() {

	}

	instructionHandler() {

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