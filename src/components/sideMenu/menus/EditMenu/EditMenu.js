const Menu = require('../menu');
const Form = require('../../../formBuilder/formBuilder').Form;
const Container = require('../../../formBuilder/formBuilder').Container;
const Field = require('../../../formBuilder/formBuilder').Field;
const uPlotEditingMenu = require('./menus/EditMenus').uPlot;
module.exports = class EditMenu extends Menu {

	constructor() {

		super('Edição', 'edit_menu');

		this.panel = document.createElement('div');
		this.uPlotEditingMenu = new uPlotEditingMenu();

		this.form = new Form({
			BlockModuleContainer: Container.spliter({
				title: Field.text({
					label: 'Título',
					att: 'blockTitle',
				}),
				module: Field.select({
					label: 'Selecione um módulo',
					att: 'type',
					id: 'BlockModule',
					options: [{
						text: 'uPlot',
					},
					{
						text: 'Blank',
					},
					{
						text: 'TODO Three.js',
					},
					],
				}),
			}, {
				startOpen: true,
				text: 'Geral',
				id: 'BlockModuleContainer',
			}),
			uPlotModule: this.uPlotEditingMenu.form,
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

	panelConfig() {

		this.panel.style.width = '100%';

		const panelContent = document.createElement('div');
		panelContent.style.padding = '1.4em';
		panelContent.style.color = 'whitesmoke';
		panelContent.style.textAlign = 'center';
		panelContent.style.border = '1px solid #a9a9a963';
		panelContent.style.margin = '1.2em';

		panelContent.textContent = 'Selecione ou adicione um novo bloco para começar a editar';

		this.panel.appendChild(panelContent);

	}

	onOpen() {

		if (window.CurrentBlock) {

			this.form.htmlComponent.classList.remove('d-none');
			this.panel.classList.add('d-none');

		} else {

			this.form.htmlComponent.classList.add('d-none');
			this.panel.classList.remove('d-none');

		}

	}

	load() {

		const menuContainer = document.createElement('div');
		menuContainer.className = 'menuBody';
		menuContainer.style.height = '100%';
		menuContainer.appendChild(this.form.htmlComponent);
		menuContainer.appendChild(this.panel);

		this.menuComponent.appendChild(menuContainer);
		this.panelConfig();

		this.form.htmlComponent.oninput = () => {

			window.CurrentBlock.updateBlockConfig(this.form.getData());

		};

		this.EventHandler.addEventListener('BlockWasSelected', (evt) => {

			this.form.reset();
			this.form.setData(evt.block.formConfig);
			this.form.setConditions();

		});

	}

};