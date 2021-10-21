const remote = require('electron').remote;
const { Menu, MenuItem } = remote;

module.exports = class BlockMenu {

    constructor(blockContainer) {

        this.menu = new Menu();

        this.menu.append(new MenuItem({
            label: 'Editar',
            click() {

                blockContainer.editBlock();

            },
         }));

        this.menu.append(new MenuItem({
            label: 'Deletar',
            click() {

                window.dispatchEvent(new CustomEvent('RemoveBlock', {
                    detail: blockContainer,
                }));

            },
        }));

    }

    menuPopUp() {

        if (window.GlobalContext == 'editing')
            this.menu.popup(remote.getCurrentWindow());

    }

};
