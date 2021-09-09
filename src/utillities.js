const fs = require('fs'); 

module.exports = class Utillities {
	static texts = JSON.parse(fs.readFileSync('./assets/utillities/utillitiesTexts.json'));

	static colors = JSON.parse(fs.readFileSync('./assets/utillities/utillitiesColors.json'));

	static theme = 'main'

	static language = 'ptbr'

	static getColor(colorNumber) {
		return (this.colors[this.theme])[colorNumber];
	}

	static getButtonText(buttonNumber) {
		return (this.texts[this.language]).buttons[buttonNumber];
	}
};