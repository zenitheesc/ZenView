const remote           = require('electron').remote;
const {Menu, MenuItem} = remote;

module.exports = class BlockMenu {
    
    constructor() {

        this.menu = new Menu();

        this.menu.append (new MenuItem ({
            label: 'Editar',
            click() { 

               console.log('Editar')
            
            }
         }));

        this.menu.append (new MenuItem ({
            label: 'Deletar',
            click() { 
            
                console.log('Deletar')
            
            }
        }));
    
    }

    menuPopUp() {

        this.menu.popup(remote.getCurrentWindow());

    }

}