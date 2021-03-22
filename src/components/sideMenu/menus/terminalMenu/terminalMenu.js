const {Terminal} = require('xterm');
const Menu = require('../menu');
const {Form, Container, Field} = require('../../../formBuilder/formBuilder');
const EventHandler = require('../../../eventHandler/eventHandler');

module.exports = class TerminalMenu extends Menu {

	constructor() {

		super('Terminal', 'terminal_menu');

        this.eventHandler = new EventHandler();

        this.serialTerminal = new Form({
			serialTerminalSpliter: Container.spliter({
                sendData: Field.text({
                    label: 'Enviar informação via Serial',
                    att: 'sendData',
                }),
                echoCheckout: Field.checkBox({
                    label: 'Echo',
                    id: 'echoCheckout',
                }),
                timestampCheckout: Field.checkBox({
                    label: 'Mostrar timestamp',
                    id: 'timestampCheckout',
                }),
            }, {
				startOpen: true,
				text: 'Terminal Serial',
				id: 'serialTerminalSpliter',
			}),
		});

        this.systemTerminal = new Form({
			systemTerminalSpliter: Container.spliter({}, {
				startOpen: true,
				text: 'Terminal do Sistema',
				id: 'systemTerminalSpliter',
			}),
		});

	}

    configSerialTerminal() {

        const terminalContainer = document.createElement('div');
        const terminal = new Terminal({
            cols: 40,
            rows: 20,
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
        this.serialTerminal.formThree.serialTerminalSpliter.sendData.htmlComponent.appendChild(serialTerminalContainer);

        this.menuComponent.appendChild(this.serialTerminal.htmlComponent);
        this.menuComponent.appendChild(this.systemTerminal.htmlComponent);

        this.serialTerminal.formThree.serialTerminalSpliter.sendData.htmlComponent.addEventListener('keyup', (evt) => {

            if (evt.keyCode === 13 && window.GlobalContex === 'running') {

                evt.preventDefault();
                this.eventHandler.SendSerialData(this.serialTerminal.formThree.serialTerminalSpliter.sendData.value);

                if (this.serialTerminal.formThree.serialTerminalSpliter.echoCheckout.value) {

                    this.eventHandler.RawData(this.serialTerminal.formThree.serialTerminalSpliter.sendData.value);

                }

                this.serialTerminal.formThree.serialTerminalSpliter.sendData.value = '';

            }

        });

    }

};