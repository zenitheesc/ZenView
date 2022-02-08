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
        const shell = require('electron').shell;
        
        const info = document.createElement('div');
        info.style.color = 'white';
        
        const version = document.createElement('h5');
        version.textContent = 'v1.0';
        version.style.textAlign = 'center';
        
        const aboutUs = document.createElement('h4');
        aboutUs.textContent ='Sobre nós:'
        
        const aboutUsText = document.createElement('p');
        aboutUsText.textContent = 'O Zenith é uma extracurricular da USP, nosso foco é no desenvolvimento de sondas e satélites. Dessa forma, o grupo se ramifica em diversas áreas da tecnologia, como hardware, software, estrutura e entre outras. ';
        
        const zenithLink = document.createElement('p');
        zenithLink.textContent = 'Visite o nosso site';
        zenithLink.addEventListener('click', event=>shell.openExternal('https://zenith.eesc.usp.br/'));
        zenithLink.style.color='blue';
        zenithLink.style.cursor='pointer';
        
        info.appendChild(aboutUs);
        info.appendChild(aboutUsText);
        info.appendChild(version);
        
        aboutUsText.appendChild(zenithLink);
        this.menuComponent.appendChild(info);
    }

    load(){
        this.progResum();
        this.progInfo();
    }

};
