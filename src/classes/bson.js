const BSON = require('bson');
const fs = require('fs');

module.exports = class BSONconverter {

    writeFile(path, object) {

        const BSONdocument = BSON.serialize(object);
        fs.writeFile(path, BSONdocument, (err) => {

            if (err) throw err;

        });

    }

    readFile(path) {

        const JSONdocument = BSON.deserialize(fs.readFileSync(path));
        return JSONdocument;

    }

};