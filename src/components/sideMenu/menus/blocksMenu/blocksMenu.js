const Menu = require('../menu');
const Section = require('./section');
module.exports = class BlocksMenu extends Menu {

	constructor() {

		super('Blocos disponíveis', 'blocks_menu');

		this.container = document.createElement('div');

	}
	
	appendSection(section) {

		this.container.appendChild(section.htmlComponent);

	}

	loadSections() {

		this.appendSection(new Section('uPlotSection', 'Plots 2D'));
		this.appendSection(new Section('uPlotSection', 'Plots 3D'));
		this.appendSection(new Section('GPSSection', 'GPS'));
		this.appendSection(new Section('uPlotSection', 'Modelo 3D'));

	}

	load() {

		this.container.style.height = '100%';
		this.container.style.overflowY = 'auto';

		this.menuComponent.appendChild(this.container);
		this.loadSections();

	}

};
