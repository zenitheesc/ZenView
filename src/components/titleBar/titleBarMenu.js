const Menu = require('electron').Menu;

module.exports = class TitleBarMenu {

	constructor() {

		const template = [
            {
                label: 'Importar dashboard       Ctrl+O',
                accelerator: 'Control+O',
                click(event, focusedWindow, focusedWebContents) { 

                    focusedWindow.webContents.send('ImportDashboard');
                                    
                },
            },
            {
                label: 'Salvar dashboard             Ctrl+S',
                accelerator: 'Control+S',
                click(event, focusedWindow, focusedWebContents) {

                    focusedWindow.webContents.send('SaveDashboard');                    
                },
            }
        ];

        this.menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(this.menu);

	}

};