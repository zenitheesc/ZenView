const LineByLine = require('n-readlines');

// module.exports =
class CsvReader {

	constructor() {

		this.lineReader;
		this.delay = 0;
		this.data = [];
		this.inputDelay;
		this.lastDelay = 0;

	}

	init(readConfig) {

		this.data = [];
		this.delay = 0;

		this.lineReader = new LineByLine(readConfig.filePath);

		if (readConfig.simulate) {

			if (readConfig.simulation.intervalType === 'fixed') {

				console.log('Simulação de intervalo fixo');
				this.delay = readConfig.simulation.fixIntervalSize;
				this.readWithFixedDelay();

			} else {

				console.log('Simulação de intervalo váriavel');
				this.inputDelay = readConfig.simulation.timeIntervalInput;
				this.readWithInputDelay();

			}

		} else {

			this.read();

		}


	}

	readWithInputDelay() {

		this.data = this.readNextLine();

		if (this.data) {

			this.delay = this.data[this.inputDelay] - this.lastDelay;
			this.delay = (this.delay > 0)? this.delay : 1;

			postMessage(this.data);

			setTimeout(() => {

				this.readWithInputDelay();

			}, this.delay);

			this.lastDelay = this.data[this.inputDelay];

		}

	}

	readWithFixedDelay() {

		this.data = this.readNextLine();

		if (this.data) {

			postMessage(this.data);

			setTimeout(() => {

				this.readWithFixedDelay();

			}, this.delay);

		}

	}

	read() {

		this.data = this.readNextLine();
		const duracao = Date.now();
		console.log('iniciando leitura');

		while (this.data) {

			this.data = this.readNextLine();

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