const fs = require('fs');

module.exports = class DataReader {

	constructor() {

		this.csvReader = new Worker(__dirname + '/types/csvReader.js');
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

			window.addEventListener('dataIsProcessed', (evt) => {

				this.saveOutput(evt.detail);

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

		window.addEventListener('StartRead', (evt) => {

			this.startRead(evt.detail);

		});

		window.addEventListener('StopRead', () => {

			this.stopRead();

		});

		this.csvReader.onmessage = (evt) => {

			if (evt.data) {

				window.dispatchEvent(new CustomEvent('dataIsReady', {
					detail: evt.data,
				}));


			} else {

				window.dispatchEvent(new CustomEvent('DataReadingFinished'));


			}


		};

	}

};