const remote           = require('electron').remote;
const {Menu, MenuItem} = remote;

module.exports = class BlockMenu {
    
    constructor(htmlComponent) {

        this.menu = new Menu();

        this.menu.append (new MenuItem ({
            label: 'Editar',
            click() { 

                console.log('Editar');
            
            }
         }));

        this.menu.append (new MenuItem ({
            label: 'Deletar',
            click() { 

                window.dispatchEvent(new CustomEvent('RemoveBlock', {
                    detail: htmlComponent,
                }));
            
            }
        }));
    
    }

    menuPopUp() {

        this.menu.popup(remote.getCurrentWindow());

    }

}