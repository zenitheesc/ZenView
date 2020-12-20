const Menu = require('electron').Menu;

module.exports = class TitleBarMenu {

	constructor() {

		const template = [
			{
				label: 'Edit',
				submenu: [
					{
						role: 'copy',
					},
					{
						role: 'paste',
					},
				],
			}];

		this.menu = Menu.buildFromTemplate(template);
		    Menu.setApplicationMenu(this.menu);

	}

};