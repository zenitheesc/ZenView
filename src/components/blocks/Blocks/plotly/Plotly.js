const Scatter = require('./scatter');
// eslint-disable-next-line no-unused-vars
const ElementResize = require('javascript-detect-element-resize');

module.exports = class scatter {

	constructor(preConfig) {

		if (preConfig.Plotly.type === 'scatter') {

			return new Scatter(preConfig);

		}


	}

};