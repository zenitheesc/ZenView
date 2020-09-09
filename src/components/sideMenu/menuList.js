const MenuItem = require('./menuItem');
const Utillities = require('../../utillities');
module.exports = class MenuList {
	constructor(){
		this.menuListComponent = document.getElementById('MenuList');
	}
	loadOptions(containerName,menuItens){
		let container = document.createElement('div');
		container.id = containerName;
		menuItens.forEach( menuItem => {
			container.appendChild(menuItem.htmlComponent());
		});
		this.menuListComponent.appendChild(container);
	}
	loadTopOptions(){
		let menuItens = [];
		menuItens.push(new MenuItem('dashboards','grid-1x2',Utillities.getButtonText(1)));
		menuItens.push(new MenuItem('newDashboard','plus-square',Utillities.getButtonText(2)));
		this.loadOptions('topContainer',menuItens);
	}
	loadMidOptions(){
		let menuItens = [];
		menuItens.push(new MenuItem('start','play',Utillities.getButtonText(3)));
		menuItens.push(new MenuItem('inputs','terminal',Utillities.getButtonText(4)));
		menuItens.push(new MenuItem('blocks','clipboard-data',Utillities.getButtonText(5)));
		menuItens.push(new MenuItem('delete','trash',Utillities.getButtonText(6)));
		menuItens.push(new MenuItem('save','save',Utillities.getButtonText(7)));
		this.loadOptions('midContainer',menuItens);
	}
	loadBottomOptions(){
		let menuItens = [];
		menuItens.push(new MenuItem('about','info-circle',Utillities.getButtonText(8)));
		menuItens.push(new MenuItem('configs','gear',Utillities.getButtonText(9)));
		this.loadOptions('bottonContainer',menuItens);
	}
	build(){
		this.loadTopOptions();
		this.loadMidOptions();
		this.loadBottomOptions();
	}
};