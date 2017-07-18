const mongoose = require('mongoose');
const _pick = require('lodash/pick');
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

function getUserDataFromUserModel(user) {
    return _pick(user, [
        '_id',
        'name',
        'email'
    ]);
}
exports.getUserDataFromUserModel = getUserDataFromUserModel;

function getUserByEmailAndPassword(email, password, cb) {
    User.findOne({
        email
    },
    'name email passwordHash',
    (error, user) => {
        if (error) {
            cb(error);
        } else if (user && verifyPassword(password, user.passwordHash)) {
            cb(null, getUserDataFromUserModel(user));
        } else {
            cb(new Error('Email or password not valid'));
        }
    });
}
exports.getUserByEmailAndPassword = getUserByEmailAndPassword;

function createUser({ name, email, password }, cb) {
    const passwordHash = hashPassword(password);

    const userInfo = {
        name,
        email,
        passwordHash
    };

    const user = new User(userInfo);
    user.save(cb);
}
exports.createUser = createUser;
