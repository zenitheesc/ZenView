const LineByLine = require('n-readlines');

// module.exports =
class CsvReader {

	constructor() {

		this.lineReader;
		this.delay = 0;
		this.data = [];

	}

	init(readConfig) {

		this.data = [];
		this.delay = 0;

		this.lineReader = new LineByLine(readConfig.filePath);

		if (readConfig.simulate) {

			if (readConfig.simulation.intervalType = 'fixed') {

				this.delay = readConfig.simulation.fixIntervalSize;

			}

			this.readWithDelay();

		} else {

			this.read();

		}


	}

	setData() {

	}

	readWithDelay() {

		this.data = this.readNextLine();
		this.setData();

		postMessage(this.data);
		setTimeout(()=>{

			this.readWithDelay();

		}, this.delay);

	}

	read() {

		this.data = this.readNextLine();
		const duracao = Date.now();
		console.log('iniciando leitura');

		while (this.data) {

			this.data = this.readNextLine();
			this.setData();

			postMessage(this.data);

		}

		console.log('duração: ' + (Date.now() - duracao));

	}

	readNextLine() {

		const line = this.lineReader.next();
		return (line) ? line.toString().split(',') : false;

	}

}

const csvReader = new CsvReader();

onmessage = (data) => {

	csvReader.init(data.data);

};