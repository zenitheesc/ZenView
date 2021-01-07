const globalShortcut = require('electron').globalShortcut;

module.exports = class Shortcuts {

    constructor(win) {
        
        globalShortcut.register('Control+S', () => {
        
            win.webContents.send('SaveDashboard', {});
    
        });


        globalShortcut.register('Control+O', () => {
    
            win.webContents.send('ImportDashboard');
    
        });

    }

}