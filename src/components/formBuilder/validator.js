module.exports = class Validator {

	static isFilled(value) {

		if (value === '' || value === undefined) {

			return 'Esse campo é obrigatório';

		} else {

			return true;

		}

	}
	static noSpecialChars(value) {

		const format = /^[A-Z0-9 _]*[A-Z0-9][A-Z0-9 _]*$/;
		if (!format.test(value)) {

			return 'Não são permitidos caracteres especiais';

		} else {

			return true;

		}

	}

	static isInRange(min, max) {

		return function(value) {

			if (value >= min && value <= max) {

				return true;

			} else {

				return 'Deve ser um número entre ' + min + ' ' + max;

			}

		};

	}

	static extension(requiredExtension) {

		return function(value) {

			if (String(value).endsWith(requiredExtension)) {

				return true;

			} else {

				return 'O arquivo deve ser do tipo ' + requiredExtension;

			}

		};

	}

	static isPositive(value) {

		if (value >= 0 ) {

			return true;

		} else {

			return 'Deve ser um número maior que 0';

		}

	}

	static isNumber(value) {

		const format = /^[0-9]*$/;
		if (!format.test(value)) {

			return 'Não são permitidos caracteres especiais ou letras';

		} else {

			return true;

		}

	}

};