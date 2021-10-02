const Container = require('../../../../../formBuilder/formBuilder').Container;
const Field = require('../../../../../formBuilder/formBuilder').Field;


module.exports = class terminalEditMenu {

    constructor() {

        this.form = Container.div({},{
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
