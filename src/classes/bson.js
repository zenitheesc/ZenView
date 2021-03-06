const BSON = require('bson');
const fs = require('fs');

module.exports = class BSONconverter {

    writeFile(path, object) {

        const BSONdocument = BSON.serialize(object);
        fs.writeFileSync(path, BSONdocument, (err) => {

            if (err) throw err;

        });

    }

    readFile(path) {

        return BSON.deserialize(fs.readFileSync(path));

    }

};