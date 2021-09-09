const os = require('os');
const pty = require('node-pty');
const {Terminal} = require('xterm');
const Block = require('../block');

module.exports = class TerminalBlock extends Block {

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
        this.ptyProcess = pty.spawn(os.platform() === 'win32' ? 'powershell.exe' : 'bash', [], {
            cols: 10,
            rows: 10,
            cwd: process.env.HOME,
            env: process.env
        });
    }

    updateTerminal(){
		const widget = this.htmlComponent.parentElement;
        const width = widget.offsetWidth;
        const height = widget.offsetHeight;
        const cols = Math.floor(width/9);
        const rows = Math.floor(height/17);
        console.log("comprmineto e altura",width,height);
        console.log("colunas e linhas",cols,rows);
        this.terminal.resize(cols,rows);
        this.ptyProcess.resize(cols,rows);

        
    }
    configSystemTerminal() {

        const terminalContainer = document.createElement('div');
        this.terminal.open(terminalContainer);
        this.terminal._initialized = true;
        this.ptyProcess.onData(recv => this.terminal.write(recv));
        this.terminal.onData(send => this.ptyProcess.write(send));
        return terminalContainer;

    }

    init(){
        this.htmlComponent.appendChild(this.configSystemTerminal());
        this.setAutoResize();
        console.log("iniciado");
    }

    load(){
        this.htmlComponent.appendChild(this.configSystemTerminal());
        this.setAutoResize();
        console.log("carregado");
    }
    
    setAutoResize(){
		const widget = this.htmlComponent.parentElement;

		addResizeListener(widget, () => {
            this.updateTerminal();
		});
        console.log("redimensionado");
    }


};
