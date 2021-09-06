const Menu = require('../menu');
const Form = require('../../../formBuilder/formBuilder').Form;
const Container = require('../../../formBuilder/formBuilder').Container;
const Field = require('../../../formBuilder/formBuilder').Field;
const EditMenus = require('./menus/EditMenus');

module.exports = class EditMenu extends Menu {

	constructor() {

		super('Edição', 'edit_menu');

		this.panel = document.createElement('div');

		this.formsComponents = {}
		this.forms = {}

		this.currentBlock;

		for(const Menu in EditMenus){
			this.formsComponents[Menu] = new EditMenus[Menu](this.currentBlock)
			this.forms[Menu] = this.formsComponents[Menu].form
		}

		this.generalContainer = Container.spliter({
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
			id: 'generalContainer',
		})

		this.modulesForms = Container.div({
			...this.forms,
		},{
			att: "blockConfig",
		})

		this.form = new Form({
			generalContainer: this.generalContainer,
			modulesForms: this.modulesForms,
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

	changeGeneralConfig(){

	}

	load() {

		const menuContainer = document.createElement('div');
		menuContainer.className = 'menuBody';
		menuContainer.style.height = '100%';
		menuContainer.appendChild(this.form.htmlComponent);
		menuContainer.appendChild(this.panel);

		this.menuComponent.appendChild(menuContainer);
		this.panelConfig();

		this.modulesForms.htmlComponent.oninput = () => {

			if (this.form.validate()) {
				this.currentBlock.updateBlockConfig(this.form.getData());
			}

		};

		this.generalContainer.htmlComponent.oninput = () => {
			this.currentBlock.uptadeBlockGeneralConfig(this.form.getData());

		};

		this.modulesForms.htmlComponent.addEventListener('input', (evt) => {

			if(this.modulesForms.validate()){
				this.currentBlock.updateBlockConfig(this.form.getData());
			}
			evt.stopPropagation();

		});

		this.EventHandler.addEventListener('BlockWasSelected', (blockContainer) => {

			this.currentBlock = blockContainer;
			this.form.reset();
			this.form.setData(blockContainer.formConfig);
			this.form.setConditions();

		});

	}

};
