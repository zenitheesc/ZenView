const Scatter = require('./scatter');

module.exports = class uPlot {

	constructor(preConfig, htmlComponent) {

		switch (preConfig.uPlot.type) {

			case 'scatter':
				return new Scatter(preConfig, htmlComponent);
				break;

			default:
				return new Scatter(preConfig, htmlComponent);
				break;

		}

	}

};