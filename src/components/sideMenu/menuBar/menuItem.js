const Utillities = require('../../../utillities');
const fs = require('fs');
const EventHandler = require('../../eventHandler/eventHandler');
module.exports = class MenuItem {

	constructor(id, icon, menuName, context) {

		this.id = id;
		this.iconName = icon;
		this.menuName = menuName;
		this.itemComponent = document.createElement('button');
		this.icon;
		this.globalContext = [];
		this.EventHandler = new EventHandler();

		if (Array.isArray(context)) {

			context.forEach((currContext) => {

				this.globalContext.push(currContext);

			});

		} else {

			this.globalContext.push(context);

		}


	}
	setIcon() {

		const iconSvg = (fs.readFileSync('./src/images/icons/' + this.iconName + '.svg')).toString();
		this.itemComponent.innerHTML = iconSvg;

	}
	setStyle() {

		this.itemComponent.style.width = '100%';
		this.itemComponent.style.height = '3em';
		this.itemComponent.className = 'btn menuItem row m-0 deactive';
		this.itemComponent.title = this.menuName;
		this.setIcon();

	}
	clickVisualEffect() {

		const itemList = document.getElementsByClassName('menuItem');
		for (let i = 0, j = itemList.length; i < j; i++) {

			if (itemList[i] === this.itemComponent) continue;
			this.setDeactiveEffect(itemList[i]);

		}
		if (this.itemComponent.getAttribute('isOpen') === 'false') {

			this.setActiveEffect(this.itemComponent);

		} else {

			this.setDeactiveEffect(this.itemComponent);

		}

	}
	setClickVisualEffect() {

		this.itemComponent.addEventListener('click', () => {

			this.clickVisualEffect();

		});

	}
	setActiveEffect(menuItem) {

		menuItem.classList.add('active');
		menuItem.classList.remove('deactive');
		menuItem.setAttribute('isOpen', 'true');
		menuItem.style.borderLeft = '2px solid white';

	}
	setDeactiveEffect(menuItem) {

		menuItem.classList.add('deactive');
		menuItem.classList.remove('active');
		menuItem.setAttribute('isOpen', 'false');
		menuItem.style.borderLeft = '2px solid ' + Utillities.getColor(1);

	}
	setClickEffect() {

		this.itemComponent.addEventListener('click', () => {

			this.EventHandler.dispatchEvent('ChangeSideMenu', this.id);

			this.EventHandler.dispatchEvent('OpenMenu', {
				name: this.id,
			});

		});

	}
	setContextChangeEffect() {

		if (this.globalContext.includes('any')) return;

		this.EventHandler.addEventListener('GlobalContextChange', (evt) => {

			if (this.globalContext.includes(evt.context)) {

				this.itemComponent.disabled = false;

			} else {

				this.itemComponent.disabled = true;

			}

		});

		this.EventHandler.addEventListener('SetSelectionEffect', (evt) => {

			if (evt.name === this.id) {

				this.clickVisualEffect();
				this.setActiveEffect(this.itemComponent);

			}

		});

	}
	htmlComponent() {

		this.itemComponent = document.createElement('button');
		this.itemComponent.setAttribute('isOpen', 'false');
		this.setStyle();
		this.setContextChangeEffect();
		this.setClickVisualEffect();
		this.setClickEffect();
		return this.itemComponent;

	}

};