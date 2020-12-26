const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;

module.exports = class TitleBarActions {

    constructor(x, y){

        this.x = x;
        this.y = y;
        this.browserWindow = remote.getCurrentWindow();

    }

    openMenu() {

        ipcRenderer.send(`display-app-titleBar`, { x: this.x, y: this.y });

    }

    minimizeWindow() {

        if (this.browserWindow.minimizable) {

          this.browserWindow.minimize();

        }

    }

    maximizeWindow() {

        if (this.browserWindow.maximizable) {

          this.browserWindow.maximize();

        }

    }

    unmaximizeWindow() {

        this.browserWindow.unmaximize();

    }

    maxUnmaxWindow() {

        if (this.browserWindow.isMaximized()) {

            this.browserWindow.unmaximize();

        } else {

            this.browserWindow.maximize();

        }

    }

    closeWindow() {

        this.browserWindow.close();

    }

    isWindowMaximized() {

        return this.browserWindow.isMaximized();

    }
    
}