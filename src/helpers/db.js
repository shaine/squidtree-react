const mongoose = require('mongoose');
const {
    dbUri
} = require('../../config.json');

module.exports = function connect(cb) {
    mongoose.connect(dbUri);
    const db = mongoose.connection;

    db.on('error', error => {
        console.error('DB connection error', error);
        cb(error);
    });

    db.once('open', () => {
        console.info('----\n==> ✅  Connected to DB');
        cb(null, db);
    });

    return db;
};
