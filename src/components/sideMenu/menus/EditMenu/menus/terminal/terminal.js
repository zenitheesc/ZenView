const Container = require('../../../../../formBuilder/formBuilder').Container;

module.exports = class terminalEditMenu {

    constructor() {

        this.form = Container.div({}, {
                id: 'terminalEditMenuConfig',
                att: 'terminal',
                conditions: [
                    {
                        id: 'BlockModule',
                        att: 'value',
                        requiredValue: 'terminal',
                    },
                ],
            },
        );

    }

};