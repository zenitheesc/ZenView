const os = require('os');
const {Terminal} = require('xterm');
const Block = require('../block');
const EventHandler = require('../../../eventHandler/eventHandler');

module.exports = class SerialTerminalBlock extends Block {

	constructor(preConfig, htmlComponent) {

		super(preConfig,htmlComponent)
        this.terminal = new Terminal({
            cols: 10,
            rows: 10,
            theme: {
                background: '#3c3c3c',
                foreground: '#f5f5f5',
                fontSize: 8,
            }
        });
        this.eventHandler =  new EventHandler();
    }

    updateTerminal(){
		const widget = this.htmlComponent.parentElement;
        const width = widget.offsetWidth;
        const height = widget.offsetHeight;
        const cols = Math.floor(width/9);
        const rows = Math.floor(height/17);
        this.terminal.resize(cols,rows);
    }

    configTerminal() {

        const terminalContainer = document.createElement('div');
        this.terminal.open(terminalContainer);
        this.terminal._initialized = false;
        this.terminal.onData(send => this.ptyProcess.write(send));

        this.eventHandler.addEventListener('RawData', (evt) => {
            
            terminal.writeln(evt);
            terminal.write('\r\n> ');
            
        });

        return terminalContainer;

    }

    init(){
        this.htmlComponent.appendChild(this.configTerminal());
        this.setAutoResize();
    }

    load(){
        this.htmlComponent.appendChild(this.configTerminal());
        this.setAutoResize();
    }
    
    setAutoResize(){
		const widget = this.htmlComponent.parentElement;

		addResizeListener(widget, () => {
            this.updateTerminal();
		});
    }


};
