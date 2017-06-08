const mongoose = require('mongoose');
const _omit = require('lodash/omit');
const {
    hashPassword,
    verifyPassword
} = require('../helpers/password');

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

exports.getUserByEmailAndPassword = function getUserByEmailAndPassword(email, password, cb) {
    const passwordHash = hashPassword(password);

    User.findOne({
        email
    },
    'name email passwordHash',
    (error, user) => {
        if (error) {
            cb(error);
        } else if (verifyPassword(password, user.passwordHash)) {
            cb(null, _omit(user, 'passwordHash'));
        } else {
            cb(new Error('Email or password not valid'));
        }
    });
};

exports.createUser = function createUser({ name, email, password }, cb) {
    const passwordHash = hashPassword(password);

    const userInfo = {
        name,
        email,
        passwordHash
    };

    const user = new User(userInfo);
    user.save(cb);
};
