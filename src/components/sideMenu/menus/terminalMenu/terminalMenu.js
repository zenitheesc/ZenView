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

    configSystemTerminal() {

        const terminalContainer = document.createElement('div');
        const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
        
        const terminal = new Terminal({
            cols: 40,
            rows: 20,
            theme: {
                background: '#3c3c3c',
                foreground: '#f5f5f5',
                fontSize: 8
            }
        });

        const ptyProcess = pty.spawn(shell, [], {
            cols: 40,
            rows: 20,
            cwd: process.env.HOME,
            env: process.env
        });
        
        terminal.open(terminalContainer);
        terminal._initialized = true;
        
        ptyProcess.onData(recv => terminal.write(recv));
        terminal.onData(send => ptyProcess.write(send));

        return terminalContainer;

    }

    load() {

        const serialTerminalContainer = this.configSerialTerminal();
        const systemTerminalContainer = this.configSystemTerminal();
        const spliter = Components.spliter('systemTerminalSpliter', 'Terminal do Sistema', systemTerminalContainer, true);

        this.serialTerminal.formThree.serialTerminalSpliter.sendData.htmlComponent.appendChild(serialTerminalContainer);
        this.menuComponent.appendChild(this.serialTerminal.htmlComponent);
		this.menuComponent.appendChild(spliter);

        for (let i = 0; i < document.getElementsByClassName('xterm-cursor-layer').length; i++) {

            document.getElementsByClassName('xterm-cursor-layer')[i].style.border = '1px solid #a9a9a942';

        }

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