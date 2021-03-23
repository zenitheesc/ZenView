const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const EventHandler = require('../../eventHandler/eventHandler');
const Dialog = require('../../dialog/dialog');

module.exports = class SerialReader {

    constructor() {

        this.port;
        this.portName;
        this.baudRate;
        this.parser;
        this.isReading = false;

        this.eventHandler = new EventHandler();

    }

    init(readConfig) {

        this.isReading = true;
        this.portName = readConfig.port;
        this.baudRate = parseInt(readConfig.baudRate);
        this.parser = readConfig.parser === ' ' ? ' ' : readConfig.parser.replace(/ /g, '');

        this.port = new SerialPort(this.portName, {
            baudRate: this.baudRate,
        }, (err) => {

            if (err) {

                Dialog.showDialog({
					title: 'Error',
                    type: 'error',
					message: err.message,
					buttons: ['Ok'],
				});

                this.stop();
                this.eventHandler.dispatchEvent('DataReadingFinished');
            
            };
                        
        });

        this.port.on('error', (err) => this.reconnectDialog());

        this.port.on('close', (err) => this.reconnectDialog());
        
        this.eventHandler.addEventListener('SendSerialData', (evt) => {

            this.write(evt);

        });

        this.read();

    }

    stop() {

        this.isReading = false;

    }

    close() {

        this.port.pause();
        this.port.close();
        this.stop();

    }

    reconnectDialog() {

        if (this.isReading) {
            
            Dialog.showDialog({
                title: 'Conexão',
                type: 'question',
                message: 'O dispositivo foi desconectado. Deseja finalizar a leitura ou reconectar o dispositivo?',
                buttons: ['Finalizar', 'Reconectar'],
            }, (result) => {
                
                if (result.response === 0) {
                    
                    this.stop();
                    this.eventHandler.dispatchEvent('DataReadingFinished');
                    
                } else if (result.response === 1) {
                    
                    this.port.open((err) => {
                        
                        if (err) {
                            
                            Dialog.showDialog({
                                title: 'Erro',
                                type: 'error',
                                    message: 'O dispositivo não foi reconectado corretamente. A leitura será encerrada.',
                                    buttons: ['Ok'],
                            });
                            
                            this.stop();
                            this.eventHandler.dispatchEvent('DataReadingFinished');
                            
                        }
                        
                    });
                    
                }
                
            });
        
        }
            
    }
        
    read() {
            
        const parser = this.port.pipe(new Readline());

        parser.on('data', (line) => {

            this.eventHandler.RawData(line);
            this.eventHandler.DataIsReady(line.toString().split(this.parser));

        });

    }

    write(line) {

        this.port.write(line);

    }

};