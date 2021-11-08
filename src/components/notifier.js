const Notus = require('notus');
const EventHandler = require('./eventHandler/eventHandler');

module.exports = class Notifier {

    constructor() {

        this.notus = new Notus({
            autoClose: true,
            autoCloseDuration: 5000,
            notusPosition: 'bottom-right',
            alertType: 'warning',
            htmlString: true,
        });
        this.eventHandler = new EventHandler();

        this.setEvents();

    }

    setEvents() {

        this.eventHandler.addEventListener('SendNotification', (evt) => {

            this.notus.send({
                title: evt.title,
                message: evt.message,
            });

        });

    }

};
