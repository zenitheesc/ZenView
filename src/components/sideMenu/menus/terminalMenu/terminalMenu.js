const os = require('os');
const pty = require('node-pty');
const {Terminal} = require('xterm');
const Menu = require('../menu');
const Components = require('../../../components');
const {Form, Container, Field} = require('../../../formBuilder/formBuilder');
const EventHandler = require('../../../eventHandler/eventHandler');

module.exports = class TerminalMenu extends Menu {

	constructor() {

		super('Terminal', 'terminal_menu');

        this.eventHandler = new EventHandler();

        this.serialTerminal = new Form({
			serialTerminalSplitter: Container.splitter({
                sendData: Field.text({
                    label: 'Enviar informação via Serial',
                    att: 'sendData',
                }),
                echoCheckout: Field.checkBox({
                    label: 'Echo',
                    id: 'echoCheckout',
                }),
            }, {
				startOpen: true,
				text: 'Terminal Serial',
				id: 'serialTerminalSplitter',
			}),
		});

	}

    configSerialTerminal() {

        const terminalContainer = document.createElement('div');

        const terminal = new Terminal({
            cols: 40,
            rows: 20,
            theme: {
                background: '#3c3c3c',
                foreground: '#f5f5f5',
                fontSize: 8
            }
        });

        terminal.open(terminalContainer);
        terminal._initialized = false;

        this.eventHandler.addEventListener('RawData', (evt) => {

            terminal.writeln(evt);
            terminal.write('\r\n> ');

        });

        return terminalContainer;

    }


    load() {

        const serialTerminalContainer = this.configSerialTerminal();

        this.serialTerminal.formTree.serialTerminalSplitter.sendData.htmlComponent.appendChild(serialTerminalContainer);
        this.menuComponent.appendChild(this.serialTerminal.htmlComponent);

        for (let i = 0; i < document.getElementsByClassName('xterm-cursor-layer').length; i++) {

            document.getElementsByClassName('xterm-cursor-layer')[i].style.border = '1px solid #a9a9a942';

        }

        this.serialTerminal.formTree.serialTerminalSplitter.sendData.htmlComponent.addEventListener('keyup', (evt) => {

            if (evt.keyCode === 13 && window.GlobalContext === 'running') {

                evt.preventDefault();
                this.eventHandler.SendSerialData(this.serialTerminal.formTree.serialTerminalSplitter.sendData.value);

                if (this.serialTerminal.formTree.serialTerminalSplitter.echoCheckout.value) {

                    this.eventHandler.RawData(this.serialTerminal.formTree.serialTerminalSplitter.sendData.value);

                }

                this.serialTerminal.formTree.serialTerminalSplitter.sendData.value = '';

            }

        });

    }

};
