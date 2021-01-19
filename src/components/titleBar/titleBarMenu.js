const Menu = require('electron').Menu;

module.exports = class TitleBarMenu {

	constructor() {

		const template = [
            {
                label: 'Importar dashboard',
                accelerator: 'Control+O',
                click(event, focusedWindow, focusedWebContents) {

                    focusedWindow.webContents.send('ImportDashboard');
                                    
                },
            },
            {
                label: 'Salvar dashboard',
                accelerator: 'Control+S',
                click(event, focusedWindow, focusedWebContents) {

                    focusedWindow.webContents.send('SaveDashboard');
                    
                },
            },
        ];

        this.menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(this.menu);

	}

};