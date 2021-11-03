
const scatter = require('./scatter');

const blocks = {
	scatter,
}

module.exports = class uPlot {

	constructor(preConfig, htmlComponent) {

		try {
			return new blocks[preConfig.uPlot.type](preConfig, htmlComponent);
		} catch(error) {
			console.warn(`TIPO DE BLOCO AINDA NÃO IMPLEMENTADO: ${preConfig.uPlot.type}`, error)
		}
i
	}

};