const Utillities = require('../../utillities');
const fs = require('fs');
module.exports = class MenuItem {
	constructor(id, icon, menuName, context) {
		this.id = id;
		this.iconName = icon;
		this.menuName = menuName;
		this.itemComponent = document.createElement('button');
		this.icon;
		this.globalContext = context;
	}
	setIcon() {
		let iconSvg = (fs.readFileSync('./src/images/icons/' + this.iconName + '.svg')).toString();
		this.itemComponent.innerHTML = iconSvg;
	}
	setStyle() {
		this.itemComponent.style.width = '100%';
		this.itemComponent.style.height = String(Math.floor(screen.width / 32) + 'px');
		this.itemComponent.className = 'btn menuItem row m-0 deactive';
		this.itemComponent.title = this.menuName;
		this.setIcon();
	}
	setClickVisualEffect() {
		this.itemComponent.addEventListener('click', () => {
			let itemList = document.getElementsByClassName('menuItem');
			for (let i = 0, j = itemList.length; i < j; i++) {
				if (itemList[i] === this.itemComponent) continue;
				this.setDeactiveEffect(itemList[i]);
			}
			if (this.itemComponent.getAttribute('openedMenu') === 'false') {
				this.setActiveEffect(this.itemComponent);
			} else {
				this.setDeactiveEffect(this.itemComponent);
			}
		});
	}
	setActiveEffect(menuItem) {
		menuItem.classList.add('active');
		menuItem.classList.remove('deactive');
		menuItem.setAttribute('openedMenu', 'true');
		menuItem.style.borderLeft = '2px solid white';
	}
	setDeactiveEffect(menuItem) {
		menuItem.classList.add('deactive');
		menuItem.classList.remove('active');
		menuItem.setAttribute('openedMenu', 'false');
		menuItem.style.borderLeft = '2px solid ' + Utillities.getColor(1);
	}
	setClickEffect() {
		this.itemComponent.addEventListener('click', () => {
			window.dispatchEvent(new CustomEvent('changeSideMenu', {
				detail: this.id
			}));
			window.dispatchEvent(new CustomEvent('openMenu', {
				detail: {
					name: this.id
				}
			}));
		});
	}
	setContextChangeEffect(){
		if(this.globalContext === 'all') return;
		window.addEventListener('GlobalContextChange',(evt)=>{
			if(evt.detail.context === this.globalContext){
				this.itemComponent.disabled = false;
			}else{
				this.itemComponent.disabled = true;
			}
		});
	}	
	htmlComponent() {
		this.itemComponent = document.createElement('button');
		this.itemComponent.setAttribute('openedMenu', 'false');
		this.setStyle();
		this.setContextChangeEffect();
		this.setClickVisualEffect();
		this.setClickEffect();
		return this.itemComponent;
	}
};