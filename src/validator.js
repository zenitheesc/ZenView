module.exports = class Validator{
	static isFilled(value){
		if(value === '' || value === undefined){
			return 'Esse campo é obrigatório';
		}else{
			return true;
		}
	}
	static noSpecialChars(value){
		const format = /^[a-zA-Z0-9]*$/;
		if(!format.test(value)){
			return 'Não são permitidos caracteres especiais';
		}else{
			return true;
		}
	}
};