//const CsvReader = require('./types/csvReader');

module.exports = class DataReader {
	constructor(){
		//this.csvReader = new CsvReader();
		this.csvReader = new Worker(__dirname+'/types/csvReader.js')
		this.currentReader;

		this.csvReader.onmessage = (evt)=>{
			window.dispatchEvent(new CustomEvent('dataIsReady',{detail: evt.data}));
		}
		window.ProcessedData = {};
		window.rawData = {};
	}
	
	startRead(readConfig){

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
	}

	build() {

		window.addEventListener('StartRead', (evt) => {
			this.startRead(evt.detail);
			
		});
	}
}

