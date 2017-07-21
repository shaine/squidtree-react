import mongoose from 'mongoose';
import _pick from 'lodash/pick';
import {
    hashPassword,
    verifyPassword
} from '../helpers/password';

const ROLE_ADMIN = 'admin';
const USER_FIELDS = [
    '_id',
    'name',
    'email',
    'role'
];
exports.userFields = USER_FIELDS;

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    role: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

function getUserDataFromUserModel(userModel) {
    return _pick(userModel, USER_FIELDS);
}
exports.getUserDataFromUserModel = getUserDataFromUserModel;

function getUserByEmailAndPassword(email, password, cb) {
    User.findOne({
        email
    },
    USER_FIELDS.join(' '),
    (error, userModel) => {
        if (error) {
            cb(error);
        } else if (userModel && verifyPassword(password, userModel.passwordHash)) {
            cb(null, getUserDataFromUserModel(userModel));
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

    const userModel = new User(userInfo);
    userModel.save(cb);
}
exports.createUser = createUser;

function isAdmin(user = {}) {
    return user.role === ROLE_ADMIN;
}
exports.isAdmin = isAdmin;
