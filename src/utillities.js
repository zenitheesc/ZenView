module.exports = class Utillities {
	static texts = {
		ptbr: {
			buttons: {
				1: "Dashboards",
				2: "Novo Dashboard",
				3: "Começar Leitura",
				4: "Entradas",
				5: "Novo bloco",
				6: "Deletar",
				7: "Salvar",
				8: "Sobre nós",
				9: "Configurações",
				10: "Terminal"
			}
		},
		en: {
			buttons: {
				1: "Dashboards",
				2: "New Dashboard",
				3: "Start Reading",
				4: "Inputs",
				5: "Add new Block",
				6: "Delete",
				7: "Save",
				8: "About us",
				9: "Config",
				10: "Terminal"
			}
		}
	};

	static colors = {
		main: {
			1: '#151620',
			2: '#1d1e2f',
			3: '#151620'
		}
	}

	static theme = 'main'

	static language = 'ptbr'

	static getColor(colorNumber) {
		return (this.colors[this.theme])[colorNumber];
	}

	static getButtonText(buttonNumber) {
		return (this.texts[this.language]).buttons[buttonNumber];
	}
};