const LineByLine = require('n-readlines');

// module.exports =
class CsvReader {

	constructor() {

		this.lineReader;
		this.delay = 0;
		this.data = [];
		this.inputDelay;
		this.lastDelay = 0;
		this.isReading = false;

	}

	init(readConfig) {

		this.data = [];
		this.delay = 0;
		this.isReading = true;

		this.lineReader = new LineByLine(readConfig.filePath);

		if (readConfig.simulate) {

			if (readConfig.simulation.intervalType === 'fixed') {

				this.delay = readConfig.simulation.fixIntervalSize;
				this.readWithFixedDelay();

			} else {

				this.inputDelay = readConfig.simulation.timeIntervalInput;
				this.readWithInputDelay();

			}

		} else {

			this.read();

		}


	}

	stop() {

		this.isReading = false;

	}

	readWithInputDelay() {

		this.data = this.readNextLine();

		if (this.data && this.isReading) {

			this.delay = this.data[this.inputDelay] - this.lastDelay;
			this.delay = (this.delay > 0) ? this.delay : 1;

			postMessage(this.data);

			setTimeout(() => {

				this.readWithInputDelay();

			}, this.delay);

			this.lastDelay = this.data[this.inputDelay];

		} else {

			postMessage(this.data);

		}

	}

	readWithFixedDelay() {

		this.data = this.readNextLine();

		if (this.data && this.isReading) {

			postMessage(this.data);

			setTimeout(() => {

				this.readWithFixedDelay();

			}, this.delay);

		} else {

			postMessage(this.data);

		}

	}

	read() {

		this.data = this.readNextLine();

		while (this.data && this.read) {

			this.data = this.readNextLine();

			postMessage(this.data);

		}
		postMessage(this.data);

	}

	readNextLine() {

		const line = this.lineReader.next();
		return (line) ? line.toString().split(',') : false;

	}

}

const csvReader = new CsvReader();

onmessage = (msg) => {

	if (msg.data.read !== false) {

		csvReader.init(msg.data);

	} else {

		csvReader.stop();

	}


};