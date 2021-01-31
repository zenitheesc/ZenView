const Dialog = require('./dialog');

module.exports = class ConfirmationDialog {

    static showConfirmationDialog(params, callback) {

        Dialog.showDialog({
            type: 'question',
            buttons: ['Salvar', 'Descartar', 'Cancelar'],
            title: 'Confirmação',
            message: 'Esse dashboard ainda não foi salvo',
            defaultId: 2,
            cancelId: 2,
        }, (result) => {

            if (result.response === 0) {

                window.dispatchEvent(new Event('SaveDashboard'));
                callback(params);

            } else if (result.response === 1) {

                callback(params);

            }

        });

    }

};