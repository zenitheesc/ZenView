const fs = require('fs');
const EventHandler = require('../eventHandler/eventHandler');
module.exports = class DataReader {

	constructor() {

		this.csvReader = new Worker(__dirname + '/types/csvReader.js');
		this.EventHandler = new EventHandler();
		this.currentReader;

		this.outputFileConfig;

		window.ProcessedData = {};
		window.rawData = {};

	}

	startRead(readConfig) {

		window.ProcessedData = {};
		window.rawData = {};

		switch (readConfig.readFrom) {

		case 'csv':
			this.currentReader = this.csvReader;
			this.csvReader.postMessage(readConfig.csvReadConfig);
			break;

		case 'serial':

			break;

		default:
			break;

		}

		if (readConfig.save) {

			this.outputFileConfig = readConfig.saveReadConfig;
			this.stream = fs.createWriteStream(this.outputFileConfig.filePath + '/' + this.outputFileConfig.fileName + '.csv', {
				flags: 'a',
			});

			this.EventHandler.DataIsProcessed((evt) => {

				this.saveOutput(evt);

			});

		}

	}

	stopRead() {

		this.currentReader.postMessage({
			read: false,
		});

	}

	saveOutput(data) {

		this.stream.write(JSON.stringify(data) + '\n');

	}

	build() {

		this.EventHandler.addEventListener('StartRead', (evt) => {

			this.startRead(evt);

		});

		this.EventHandler.addEventListener('StopRead', () => {

			this.stopRead();

		});

		this.csvReader.onmessage = (evt) => {

			if (evt.data) {

				this.EventHandler.DataIsReady(
					evt.data,
				);


			} else {

				this.EventHandler.DataReadingFinished();

			}


		};

	}

};