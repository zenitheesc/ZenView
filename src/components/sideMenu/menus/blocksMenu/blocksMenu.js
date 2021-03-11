const Menu = require('../menu');
const Section = require('./section');
module.exports = class BlocksMenu extends Menu {

	constructor() {

		super('Blocos disponíveis', 'blocks_menu');

		this.container = document.createElement('div');

	}
	/**
	 *
	 *
	 * @param {Section} section
	 */
	appendSection(section) {

		this.container.appendChild(section.htmlComponent);

	}

	loadSections() {

		this.appendSection(new Section('uPlotSection', 'Plots 2D'));
		this.appendSection(new Section('PlotlySection', 'Plots 3D'));
		this.appendSection(new Section('PlotlySection', 'GPS'));
		this.appendSection(new Section('PlotlySection', 'Modelo 3D'));

	}

	load() {

		this.container.style.height = '100%';
		this.container.style.overflowY = 'auto';

		this.menuComponent.appendChild(this.container);
		this.loadSections();

	}

};