// const CsvReader = require('./types/csvReader');

const fs = require('fs');

module.exports = class DataReader {

	constructor() {

		this.csvReader = new Worker(__dirname + '/types/csvReader.js');
		this.currentReader;

		this.csvReader.onmessage = (evt) => {

			window.dispatchEvent(new CustomEvent('dataIsReady', {
				detail: evt.data,
			}));

		};

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

	saveOutput(data) {

		this.stream.write(JSON.stringify(data) + '\n');

	}

	build() {

		window.addEventListener('StartRead', (evt) => {

			this.startRead(evt.detail);

		});


	}

};