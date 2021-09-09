const Menu = require('../menu');

module.exports = class InfoMenu extends Menu {

	constructor() {

		super('Informações', 'about_menu');

	}

    progResum(){
        const resume = document.createElement('div');
        resume.textContent = 'ZenView posibilita a criação de plots 2D e GPS para análise de dados adquiridos pela sonda';
        resume.style.color = 'white';
        this.menuComponent.appendChild(resume);
    }

    progInfo(){
        const info = document.createElement('div');
        info.style.textAlign = 'center';
        const version = document.createElement('h5');
        version.textContent = 'v1.0';
        info.appendChild(version);
        this.menuComponent.appendChild(info);
    }

    load(){
        this.progResum();
        this.progInfo();
    }

};
