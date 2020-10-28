const Menu = require('../menu');
const Form = require('../../../formBuilder/formBuilder').Form;
const Container = require('../../../formBuilder/formBuilder').Container;
const Field = require('../../../formBuilder/formBuilder').Field;
const PlotlyEditingMenuConfig = require('./menus/EditMenus').Plotly;

module.exports = class EditMenu extends Menu {

	constructor() {

		super('Edição', 'edit_menu');

		this.form = new Form({
			BlockModuleContainer: Container.spliter({
				module: Field.select({
					label: 'Selecione um módulo',
					att: 'module',
					id: 'BlockModule',
					options: [{
						text: 'Plotly',
					},
					{
						text: 'TODO Three.js',
					},
					],
				}),
			}, {
				startOpen: true,
				text: 'Módulos',
				id: 'BlockModuleContainer',
			}),
			PlotlyModule: PlotlyEditingMenuConfig,
			ThreejsModule: Container.div({

			}, {
				id: 'ThreejsModule',
			}),
			GPSModule: Container.div({

			}, {
				id: 'GPSModule',
			}),
		});

	}

	load() {

		const spliterContainer = document.createElement('div');
		spliterContainer.className = 'menuBody';
		spliterContainer.style.height = '100%';
		spliterContainer.appendChild(this.form.htmlComponent);
		this.menuComponent.appendChild(spliterContainer);

	}

};