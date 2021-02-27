const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const EventHandler = require('../../eventHandler/eventHandler');

module.exports = class SerialReader {

    constructor() {

        this.port;
        this.portName;
        this.baudRate;
        this.data = [];
        this.isReading = false;

        this.eventHandler = new EventHandler();

    }

    init(readConfig) {

        this.data = [];
        this.isReading = true;
        this.portName = readConfig.port;
        this.baudRate = parseInt(readConfig.baudRate);

        this.port = new SerialPort(this.portName, {
            baudRate: this.baudRate,
        }, (err) => {

            if (err) return console.log('Error: ', err.message);
                        
        });

        this.port.on('error', (err) => {

            if (err.disconnected) {

                this.stop();
                this.eventHandler.dispatchEvent('DataReadingFinished');
            
            }

        });

        this.port.on('close', (err) => {

            this.stop();
            this.eventHandler.dispatchEvent('DataReadingFinished');

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

    read() {

        const parser = this.port.pipe(new Readline());

        this.eventHandler.addEventListener('SerialPipe', (evt) => {

            this.port.pipe(evt);

        });
        
        parser.on('data', (line) => {

            this.eventHandler.DataIsReady(line.toString().split(';'));

        });

    }

};