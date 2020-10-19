const lineByLine = require('n-readlines');

//module.exports = 
class CsvReader {
	constructor() {
		this.lineReader;
		this.delay = 0;
		this.data = [];
		this.lastData = [];
	}

	init(readConfig) {
		this.data = [];
		this.delay = 0;

		this.lineReader = new lineByLine(readConfig.filePath);

		if (readConfig.simulation) {
			if (readConfig.simulation.type = 'fixed') {
				this.delay = readConfig.simulation.fixedDelay;
			}
		}

		this.readNextLine();
		this.read();
	}

	setData() {

	}

	read() {
		this.data = this.readNextLine();
		let duracao = Date.now();
		let dataReaded = {}

		while (this.data) {
			//console.log(this.data);
			this.data = this.readNextLine();
			this.setData();

			postMessage(this.data);

			dataReaded = {};
		}
		
		console.log('duração: ' + (Date.now() - duracao));
	}

	readNextLine() {
		let line = this.lineReader.next();
		return (line) ? line.toString().split(',') : false;
	}

}

const csvReader = new CsvReader();

onmessage = (data) => {
	csvReader.init(data.data);
}